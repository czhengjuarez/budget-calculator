// Cloudflare Worker script to serve static HTML, CSS, and JS
// This worker serves your static site files

import html from './index.html';
import css from './styles.css';
import js from './script.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route handling
    if (path === '/' || path === '/index.html') {
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (path === '/styles.css') {
      return new Response(css, {
        headers: {
          'Content-Type': 'text/css;charset=UTF-8',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    if (path === '/script.js') {
      return new Response(js, {
        headers: {
          'Content-Type': 'application/javascript;charset=UTF-8',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // 404 for other paths
    return new Response('Not Found', { status: 404 });
  },
};
