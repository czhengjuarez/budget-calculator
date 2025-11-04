const fs = require('fs');

// Read the static files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

// Escape backticks and ${} in the content
function escapeTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// Create the worker script
const workerScript = `export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '/index.html') {
      return new Response(\`${escapeTemplate(html)}\`, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (path === '/styles.css') {
      return new Response(\`${escapeTemplate(css)}\`, {
        headers: {
          'Content-Type': 'text/css;charset=UTF-8',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    if (path === '/script.js') {
      return new Response(\`${escapeTemplate(js)}\`, {
        headers: {
          'Content-Type': 'application/javascript;charset=UTF-8',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
`;

// Write the bundled worker
fs.writeFileSync('worker-bundle.js', workerScript);
console.log('✅ Worker bundle created successfully!');
