# Quick Deployment Guide

## ✅ Setup Complete!

Your Budget Calculator is now ready to deploy to Cloudflare Workers.

## 🚀 Next Steps

### 1. Test Locally (Already Running!)

Your dev server is currently running at: **http://localhost:8787**

You can:
- Test all functionality
- Make changes to `index.html`, `styles.css`, or `script.js`
- Run `npm run dev` again to rebuild and restart

### 2. Deploy to Cloudflare Workers

When you're ready to deploy to production:

```bash
# First, login to Cloudflare (if you haven't already)
npx wrangler login

# Then deploy
npm run deploy
```

This will:
1. Build the worker bundle
2. Upload to Cloudflare Workers
3. Give you a live URL like: `https://budget-calculator.YOUR-SUBDOMAIN.workers.dev`

### 3. Custom Domain (Optional)

After deployment, you can add a custom domain in the Cloudflare dashboard:

1. Go to Workers & Pages
2. Select your `budget-calculator` worker
3. Click "Triggers" tab
4. Add a custom domain

## 📝 Important Notes

- **Worker Name**: `budget-calculator` (can be changed in `wrangler.toml`)
- **Local Dev**: `http://localhost:8787`
- **Production**: Will be assigned after first deployment
- **Build Process**: Automatically bundles HTML, CSS, and JS into a single Worker

## 🔧 Making Changes

1. Edit your source files (`index.html`, `styles.css`, `script.js`)
2. Run `npm run dev` to test locally
3. Run `npm run deploy` to push to production

## 📚 Files Created

- ✅ `worker.js` - Original worker template
- ✅ `build.js` - Build script
- ✅ `wrangler.toml` - Cloudflare configuration
- ✅ `package.json` - Dependencies and scripts
- ✅ `.gitignore` - Git ignore rules
- ✅ `README.md` - Full documentation

## 🎉 You're All Set!

Your static site is now configured for Cloudflare Workers deployment!
