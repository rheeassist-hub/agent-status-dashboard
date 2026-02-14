// api/status.js
import fs from 'fs';
import path from 'path';

// Basic HTTP Basic Authentication
// You'll set DASHBOARD_USER and DASHBOARD_PASSWORD in Vercel environment variables
const USERNAME = process.env.DASHBOARD_USER;
const PASSWORD = process.env.DASHBOARD_PASSWORD;

const authenticate = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
    res.statusCode = 401;
    res.end('Authentication required');
    return false;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString();
    const [user, pass] = decoded.split(':');

    if (user === USERNAME && pass === PASSWORD) {
      return true;
    } else {
      res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
      res.statusCode = 401;
      res.end('Authentication required');
      return false;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.statusCode = 400;
    res.end('Invalid authentication token');
    return false;
  }
};

export default async function handler(req, res) {
  if (!authenticate(req, res)) {
    return;
  }

  // Serve the static status.json file
  const filePath = path.join(process.cwd(), 'status.json'); // Assumes status.json is in the root

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading status.json:', err);
      res.statusCode = 500;
      res.end('Error fetching status');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(data);
  });
}
