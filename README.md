# Budget Calculator - Cloudflare Workers Deployment

This is a static Budget Allocation & Planning Tool deployed on Cloudflare Workers.

## Prerequisites

- Node.js and npm installed
- A Cloudflare account
- Wrangler CLI (will be installed via npm)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 3. Configure Your Account ID (Optional)

After logging in, you can optionally get your account ID and add it to `wrangler.toml`:

```bash
npx wrangler whoami
```

Then edit `wrangler.toml` and uncomment/add your account ID:

```toml
account_id = "your-account-id-here"
```

### 4. Test Locally

Run the development server to test locally:

```bash
npm run dev
```

This will:
1. Build the worker bundle (combining HTML, CSS, and JS)
2. Start a local server at `http://localhost:8787`

Open your browser and visit `http://localhost:8787` to test the app.

### 5. Deploy to Cloudflare Workers

When you're ready to deploy:

```bash
npm run deploy
```

Your site will be deployed to: `https://budget-calculator.<your-subdomain>.workers.dev`

## Project Structure

- `index.html` - Main HTML file
- `styles.css` - Stylesheet
- `script.js` - JavaScript functionality
- `build.js` - Build script that bundles static files into the worker
- `worker-bundle.js` - Generated worker file (not committed to git)
- `wrangler.toml` - Wrangler configuration
- `package.json` - Node.js dependencies

## How It Works

The build process (`build.js`) reads your static HTML, CSS, and JS files and bundles them into a single Cloudflare Worker script (`worker-bundle.js`). The worker serves these files based on the requested path:

- `/` or `/index.html` → Serves the HTML
- `/styles.css` → Serves the CSS
- `/script.js` → Serves the JavaScript

## Features

- Budget planning across quarters
- Focus area allocation
- Exception management
- Export to CSV
- Fully responsive design

## Notes

- This deployment uses Cloudflare Workers (not Pages) as requested
- Static files are bundled directly into the Worker for maximum performance
- The `worker-bundle.js` file is auto-generated and should not be edited manually
- Each deployment creates a fresh bundle from your source files
