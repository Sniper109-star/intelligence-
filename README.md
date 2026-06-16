# Wallet Intelligence

Mobile-first Next.js 16 analytics app for Solana wallet intelligence, creator analysis, smart money tracking, risk detection, and real-time monitoring.

## Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 (mobile-first theming + responsive utilities)
- Convex (backend, DB, and real-time APIs)
- Bun (package manager and runtime)

## Prerequisites

- Bun `>=1.x`
- Node.js `>=20` (for compatibility)
- A Convex account and deployment for backend data

## Install & Run

```bash
bun install
```

Copy env template if needed:

```bash
cp .env.example .env.local
```

Run the dev server:

```bash
bun dev
```

Open `http://localhost:3000`.

## Project Structure

```
├── convex/
│   ├── schema.ts
│   └── api.ts
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── monitoring/
│   │   ├── risk/
│   │   ├── smart-money/
│   │   └── wallet/
│   └── lib/
│       ├── navigation.ts
│       └── utils.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Scripts

```bash
bun dev
bun build
bun start
bun lint
bun typecheck
```

## Mobile UX Notes

- Uses responsive grids, drawers, bottom nav, and safe-area insets.
- Bottom navigation exposes the top 5 navigation items on small screens.
- Drawer sidebar is triggered via a header hamburger button.
