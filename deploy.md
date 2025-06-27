# F.U.M Deployment Guide for Vercel

## Quick Deployment Steps

### 1. Build the Project
```bash
cd fund-ur-memory-ui
pnpm install
pnpm build
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Configure Environment Variables (if needed)
In your Vercel dashboard, add any environment variables:
- `VITE_WALLET_CONNECT_PROJECT_ID` (if using WalletConnect)
- `VITE_ALCHEMY_API_KEY` (if using Alchemy)

## Vercel Configuration

The `vercel.json` file is already configured to:
- Handle client-side routing (fixes 404 issues)
- Serve static assets correctly
- Add security headers
- Cache service worker appropriately

## Troubleshooting

### 404 Errors on Page Refresh
✅ **Fixed** - The `vercel.json` configuration redirects all routes to `index.html` for client-side routing.

### Build Errors
- Make sure all dependencies are installed: `pnpm install`
- Check TypeScript errors: `pnpm build`
- Verify all imports are correct

### Wallet Connection Issues
- Ensure the wallet connection animation works properly
- Check browser console for any errors
- Verify wagmi configuration is correct

## Performance Optimization

The build includes:
- Code splitting for better loading
- Asset optimization
- CSS minification
- Tree shaking for smaller bundles

## Security Headers

The deployment includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Custom Domain Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS records as instructed

## Monitoring

Monitor your deployment:
- Vercel Analytics (built-in)
- Error tracking via browser console
- Performance metrics in Vercel dashboard
