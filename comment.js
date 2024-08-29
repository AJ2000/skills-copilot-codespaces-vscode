// Create a web server
// Create a comment list
// Add comments to the list
// Display the comments
// Save the comments
// Load the comments

const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const path = require('path');

const comments = [];

// Create a web server
const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url);
  const urlPathname = urlObj.pathname;

  // Create a comment list
  if (urlPathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <form method="POST" action="/comment">
        <textarea name="comment" rows="5" cols="30"></textarea>
        <input type="submit" value="Submit">
      </form>
      <ul>
        ${comments.map(comment => `<li>${comment}</li>`).join('')}
      </ul>
    `);
  }

  // Add comments to the list
  else if (urlPathname === '/comment' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const query = querystring.parse(body);
      comments.push(query.comment);
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    });
  }

  // Save the comments
  else if (urlPathname === '/save') {
    fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), err => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Server Error');
        return;
      }
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    });
  }

  // Load the comments
  else if (urlPathname === '/load') {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Server Error');
        return;
      }
      comments.push(...JSON.parse(data));
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    });