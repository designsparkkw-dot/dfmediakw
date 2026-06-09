import http from 'http';
import tls  from 'tls';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3456;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  // Video — must be correct or iOS Safari refuses to play
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  // SEO / manifest
  '.xml':  'application/xml',
  '.txt':  'text/plain',
  '.webmanifest': 'application/manifest+json',
};

// ── Minimal SMTP-over-TLS client (no npm packages needed) ────────────────────
// Uses Node.js built-in `tls` module to talk directly to Hostinger's SMTP.
// Supports AUTH LOGIN (base64 user/pass) on port 465 (implicit TLS).
function sendSmtp({ host, port = 465, user, pass, from, to, replyTo, subject, html, text }) {
  return new Promise((resolve, reject) => {
    const b64 = s => Buffer.from(String(s)).toString('base64');

    let buf   = '';
    let stage = 'greeting';

    const socket = tls.connect({ host, port, servername: host }, () => {
      // Connected — wait for server greeting in the 'data' handler
    });

    socket.setTimeout(20000, () => {
      socket.destroy();
      reject(new Error('SMTP timeout'));
    });
    socket.on('error', err => reject(err));

    socket.on('data', chunk => {
      buf += chunk.toString();
      // Responses may arrive in multiple TCP packets; process complete lines only
      const lines = buf.split('\r\n');
      buf = lines.pop();           // keep any incomplete trailing fragment

      for (const line of lines) {
        if (!line) continue;
        const code    = parseInt(line.slice(0, 3), 10);
        const isFinal = line[3] === ' '; // multi-line responses use '-', final uses ' '
        if (!isFinal) continue;          // skip continuation lines

        switch (stage) {
          case 'greeting':
            if (code === 220) { socket.write('EHLO localhost\r\n'); stage = 'ehlo'; }
            else { socket.destroy(); reject(new Error(`SMTP greeting: ${line}`)); }
            break;

          case 'ehlo':
            if (code === 250) { socket.write('AUTH LOGIN\r\n'); stage = 'auth-init'; }
            else { socket.destroy(); reject(new Error(`EHLO: ${line}`)); }
            break;

          case 'auth-init':
            if (code === 334) { socket.write(b64(user) + '\r\n'); stage = 'auth-user'; }
            else { socket.destroy(); reject(new Error(`AUTH LOGIN: ${line}`)); }
            break;

          case 'auth-user':
            if (code === 334) { socket.write(b64(pass) + '\r\n'); stage = 'auth-pass'; }
            else { socket.destroy(); reject(new Error(`Auth user: ${line}`)); }
            break;

          case 'auth-pass':
            if (code === 235) { socket.write(`MAIL FROM:<${from}>\r\n`); stage = 'mail-from'; }
            else { socket.destroy(); reject(new Error(`Auth failed (check password): ${line}`)); }
            break;

          case 'mail-from':
            if (code === 250) { socket.write(`RCPT TO:<${to}>\r\n`); stage = 'rcpt-to'; }
            else { socket.destroy(); reject(new Error(`MAIL FROM: ${line}`)); }
            break;

          case 'rcpt-to':
            if (code === 250) { socket.write('DATA\r\n'); stage = 'data-cmd'; }
            else { socket.destroy(); reject(new Error(`RCPT TO: ${line}`)); }
            break;

          case 'data-cmd':
            if (code === 354) {
              // Build RFC 2822 message. Dot-stuff any lines that start with '.'
              const body = html.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');
              const msg  = [
                `From: "DF Media Website" <${from}>`,
                `To: ${to}`,
                `Reply-To: ${replyTo || from}`,
                `Subject: ${subject}`,
                `MIME-Version: 1.0`,
                `Content-Type: text/html; charset=utf-8`,
                ``,
                body,
                `\r\n.\r\n`,
              ].join('\r\n');
              socket.write(msg);
              stage = 'data-body';
            } else { socket.destroy(); reject(new Error(`DATA cmd: ${line}`)); }
            break;

          case 'data-body':
            if (code === 250) { socket.write('QUIT\r\n'); stage = 'quit'; }
            else { socket.destroy(); reject(new Error(`Message rejected: ${line}`)); }
            break;

          case 'quit':
            socket.destroy();
            resolve();
            break;
        }
      }
    });
  });
}

// ── Helper: collect POST body ────────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end',  () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

// ── Helper: sanitise a plain-text value for use inside HTML ─────────────────
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── HTTP server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  let urlPath = req.url.split('?')[0];

  // ── POST /api/contact ──────────────────────────────────────────────────────
  if (req.method === 'POST' && urlPath === '/api/contact') {
    try {
      const body = await readBody(req);
      const { name, email, phone, service, message } = body;

      // Basic server-side validation
      if (!name || !email || !/\S+@\S+\.\S+/.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Name and a valid email are required.' }));
        return;
      }

      const smtpUser = process.env.SMTP_USER || 'info@df-mediakw.com';
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpPass) {
        console.error('[contact] SMTP_PASS env var is not set');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Server email not configured.' }));
        return;
      }

      const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px;">DF Media</p>
            <p style="margin:6px 0 0;color:#888;font-size:13px;">New project enquiry from your website</p>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;width:140px;color:#888;font-size:13px;">Full Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-size:14px;font-weight:600;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;"><a href="mailto:${esc(email)}" style="color:#0066cc;text-decoration:none;">${esc(email)}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;">Phone / WhatsApp</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-size:14px;">${phone ? esc(phone) : '<span style="color:#bbb;">—</span>'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;">Service</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-size:14px;">${service ? esc(service) : '<span style="color:#bbb;">—</span>'}</td>
              </tr>
            </table>

            ${message ? `
            <div style="margin-top:28px;">
              <p style="margin:0 0 10px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.6px;">Project Details</p>
              <div style="background:#f9f9f9;border-left:3px solid #0a0a0a;padding:16px 20px;border-radius:0 4px 4px 0;">
                <p style="margin:0;color:#333;font-size:14px;line-height:1.7;white-space:pre-wrap;">${esc(message)}</p>
              </div>
            </div>` : ''}

            <div style="margin-top:32px;padding:20px;background:#f9f9f9;border-radius:6px;">
              <p style="margin:0;color:#555;font-size:13px;">Hit <strong>Reply</strong> to respond directly to <a href="mailto:${esc(email)}" style="color:#0066cc;">${esc(email)}</a>.</p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;">
            <p style="margin:0;color:#aaa;font-size:12px;">Sent from the contact form at df-mediakw.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

      await sendSmtp({
        host:    'smtp.hostinger.com',
        port:    465,
        user:    smtpUser,
        pass:    smtpPass,
        from:    smtpUser,
        to:      'info@df-mediakw.com',
        replyTo: email,
        subject: `New enquiry from ${name} — DF Media`,
        html:    htmlBody,
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));

    } catch (err) {
      console.error('[contact] SMTP error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Failed to send. Please try again.' }));
    }
    return;
  }

  // ── Static file serving ────────────────────────────────────────────────────
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Video files need byte-range (partial content) support.
  // iOS Safari always sends a Range header before playing — without this
  // it either refuses to play or stalls after a few seconds.
  if (ext === '.mp4' || ext === '.webm') {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      const fileSize = stat.size;
      const range    = req.headers.range;

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end   = endStr ? parseInt(endStr, 10) : fileSize - 1;
        res.writeHead(206, {
          'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges':  'bytes',
          'Content-Length': end - start + 1,
          'Content-Type':   contentType,
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Accept-Ranges':  'bytes',
          'Content-Type':   contentType,
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`DF Media server running at http://localhost:${PORT}`);
});
