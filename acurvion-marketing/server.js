const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const INQUIRIES_FILE = path.join(PUBLIC_DIR, 'inquiries.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle Contact API Form Submissions
  if (req.method === 'POST' && (req.url === '/api/contact' || req.url === '/api/booking')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const inquiryType = req.url === '/api/booking' ? 'Discovery Call Booking' : 'Contact Lead Form';
        
        // Basic validation
        if (!payload.email || !payload.name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Name and email are required fields.' }));
          return;
        }

        const inquiryRecord = {
          id: 'ACV-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100),
          type: inquiryType,
          timestamp: new Date().toISOString(),
          ...payload
        };

        // Persist to inquiries.json
        let existingInquiries = [];
        try {
          if (fs.existsSync(INQUIRIES_FILE)) {
            existingInquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8') || '[]');
          }
        } catch (e) {
          existingInquiries = [];
        }

        existingInquiries.push(inquiryRecord);
        fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(existingInquiries, null, 2), 'utf8');

        console.log(`[Acurvion Lead Received] Type: ${inquiryType} | ID: ${inquiryRecord.id} | Name: ${payload.name} | Email: ${payload.email}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          referenceId: inquiryRecord.id,
          message: 'Thank you for reaching out to Acurvion Marketing Agency. Your consultation inquiry has been logged successfully.'
        }));
      } catch (err) {
        console.error('Error parsing lead inquiry:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload received.' }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check: ensure path stays within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 Page Not Found | Acurvion Marketing Agency</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B1F4B; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 20px; }
    h1 { font-size: 3rem; margin-bottom: 0.5rem; color: #1769FF; }
    p { font-size: 1.2rem; color: #F5F7FB; max-width: 500px; margin-bottom: 1.5rem; line-height: 1.6; }
    a { display: inline-block; background: linear-gradient(135deg, #1769FF, #6C2BFF); color: #FFF; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <h1>404</h1>
  <h2>Page Not Found</h2>
  <p>The page you are looking for does not exist or has been moved. Explore our growth marketing services or return home.</p>
  <a href="/">&larr; Return to Acurvion Home</a>
</body>
</html>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Acurvion Marketing server is active at http://localhost:${PORT}`);
});
