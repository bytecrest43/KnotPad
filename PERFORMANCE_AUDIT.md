Frontend Performance Audit and Optimization Plan

Date: 2025-08-09 22:46 (local)
Scope: Next.js App Router application “KnotPad”

Objectives
- Reduce render-blocking resources and JS execution cost
- Minimize JavaScript bundle size and hydration work
- Optimize asset delivery (images, fonts, CSS)
- Improve responsiveness (input delay, interaction to next paint)
- Lower API response times and unnecessary network usage

Key Metrics and Targets
- TTFB: < 200 ms (production, CDN/edge cached pages) | < 500 ms (dynamic)
- FCP: < 1.5 s on 4x CPU throttling, Fast 3G/Slow 4G
- LCP: < 2.5 s (75th percentile)
- CLS: < 0.05
- TTI (or INP/Interaction readiness): TTI < 3.5 s, INP < 200 ms

Tooling
- Lighthouse (Chrome DevTools > Lighthouse) for lab checks
- WebPageTest (mobile, 3G/4G, repeat views) for network waterfall and caching verification
- Chrome DevTools Performance + Coverage tabs for main-thread and unused code
- Next.js Analyzer: next build with analyze to inspect bundle composition
- Chrome Performance Insights and INP field data (if using real-user monitoring later)

Quick Start: How to Measure
1) Local build: pnpm build && pnpm start
2) Lighthouse: Run desktop + mobile; record TTFB, FCP, LCP, CLS, TTI/INP.
3) WebPageTest: Test cold and repeat view; verify caching headers; note waterfall gaps.
4) DevTools Performance: Record load + initial typing in editor; check scripting time and long tasks.
5) Coverage: Open Coverage tab; reload; sort by unused bytes.

Implemented Optimizations in This Repo
1) Lazy-loaded heavy editor (reduces initial JS and hydration)
   - app/dashboard/notebook/[notebookId]/note/[noteId]/page.tsx now dynamically imports the TipTap editor with SSR disabled and a lightweight skeleton fallback:
     const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
       ssr: false,
       loading: () => (
         <div style={{ height: 240 }} className="animate-pulse rounded-md bg-muted/40" />
       ),
     });
   Impact: Smaller server and client bundles for the initial route; reduced render-blocking and faster FCP/TTI for note pages.

2) Debounced note saving to reduce network/API pressure and main-thread work
   - components/rich-text-editor.tsx debounces updateNote calls using an internal timer to batch changes (~500 ms window). This reduces request volume and improves responsiveness during typing.

3) Asset caching and compression headers
   - next.config.ts now enables gzip/ Brotli compression and sets Cache-Control headers for static assets, Next.js static chunks, images, and API routes:
     - _next/static and _next/image: max-age=31536000, immutable
     - Public assets (images, fonts): max-age=31536000, immutable
     - API routes: s-maxage=60, stale-while-revalidate=300 (tune as needed)
   Impact: Repeat views are significantly faster; better TTFB and FCP.

4) Fonts
   - Using next/font (Geist) which self-hosts fonts and uses font-display: swap; eliminates render-blocking font CSS and avoids external font CDNs.

Recommended Next Steps (Actionable)
1) Route-level code splitting and lazy components
   - Continue using next/dynamic for below-the-fold or rarely-used components (e.g., call-to-action variants, charts, heavy icons sets):
     const CTA = dynamic(() => import("@/components/call-to-action"), { ssr: false });
   - Ensure server components do not import client-only dependencies to avoid promoting entire trees to client bundles.

2) Images
   - Verify hero images above the fold use appropriate sizes and do not both load (dark/light). Consider using one <Image> with prefers-color-scheme media source or conditional render to avoid double fetch.
   - Convert large PNGs to optimized WebP/AVIF where quality allows. The repo is configured to serve AVIF/WebP.
   - For critical hero image: consider priority only if a single image is rendered to avoid double preloads.

3) Icons and libraries
   - lucide-react is tree-shakeable, but only import specific icons (already done). Avoid wildcard icon sets.
   - Audit framer-motion usage; prefer reduced motion where not visible, and lazy-load animation-heavy sections.

4) CSS and reflow minimization
   - Reserve space for dynamic elements (skeletons, images) via explicit width/height or aspect-ratio (already used) to keep CLS low.
   - Avoid measuring layout in loops; batch DOM reads/writes if custom code is added.

5) Network and API performance
   - Debounce user-triggered updates (already). Consider server-side batching: queue edits and persist every N seconds or on blur.
   - Use edge runtime where feasible for low-latency reads (Next.js Edge Routes) and enable database connection pooling.
   - Add response compression (set) and ensure JSON payloads are minimal.

6) Prefetching strategy
   - Rely on Next.js automatic prefetch for visible links. For routes with heavy JS, consider prefetch={false} to avoid surprising background downloads on slow networks.
   - Use react cache or SWR with stale-while-revalidate for dashboards to make navigations instant.

7) Bundle analysis and constraints
   - Add an analyzer (next-bundle-analyzer) to pinpoint large deps. Suggested dev-only configuration:
     // next.config.ts (dev only)
     // const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
     // module.exports = withBundleAnalyzer(nextConfig)
   - Target initial JS < 150 KB gz for primary entry routes.

8) Monitoring and budgets
   - Set Lighthouse performance budget JSON and track in CI if possible.
   - Track INP, LCP using something like Vercel Web Analytics or a RUM tool.

Checklist to Validate After Deployment
- First-load Lighthouse mobile: Perf >= 90, LCP < 2.5 s, CLS < 0.05, INP < 200 ms
- WebPageTest: repeat view shows 304s or from cache for static assets; TTFB acceptable; no blocking fonts
- Network: no large unused JS on non-editor routes
- Main thread: no long tasks > 200 ms during initial paint and typing

Appendix: Useful Commands
- Build: pnpm build && pnpm start
- Dev: pnpm dev
- Lint: pnpm lint
- Run Lighthouse: DevTools > Lighthouse > Mobile & Desktop
- WebPageTest: https://www.webpagetest.org/ with Mobile, LTE/4G, First & Repeat View
