# Renew Home 🌱⚡

**Cheaper times. Cleaner times. No effort.**

A fully **simulated** B2C prototype for *Renew Home* — a service that connects a home's smart
thermostat to the power grid and shifts energy use toward the cheapest, cleanest moments of the
day. The homeowner saves money (~$100/yr), cuts CO₂, and stays in full control — effortlessly.

> ⚠️ **Everything here is fake.** There is no backend, no real device, no real auth, and no real
> grid. Savings, device activation, grid peak events, and rewards are all simulated on the client.
> Numbers are illustrative only.

### 📱 Designed as a phone app (Apple "Liquid Glass")

The whole experience is a **mobile-first web app** presented inside an iPhone-style device frame
(`src/components/shell/PhoneFrame.tsx`): an iOS status bar with a live clock, a Dynamic Island, a
frosted-glass bottom tab bar, and ambient colour blobs that glow behind translucent "Liquid Glass"
surfaces. On a real phone (viewport < 640px) it renders **full-screen, edge to edge**; on larger
screens it shows the centered phone so you can preview it at true phone dimensions. The glass look
is centralized in `src/app/globals.css` (`.card`, `.glass-nav`, `.glass-pill`, `.glass-dark`).

---

## ✨ What's inside

It's a real **app**, not just a landing page — three connected views:

1. **Landing page** (`/`)
   Sticky header, animated hero, compatibility logos, an **interactive savings calculator**,
   "How it works", value cards, social proof, and an FAQ accordion. Includes a "Watch Explainer"
   modal with an auto-playing walkthrough.

2. **Activation flow** (`/activate`)
   A guided, multi-step onboarding wizard that mimics real device onboarding:
   - **Step 1** — choose your thermostat brand
   - **Step 2** — a fake OAuth-style "Authorize Renew Home" card with a spinner that resolves to
     **Connected ✓**
   - **Step 3** — set comfort preferences (target temperature + optimization style, which changes
     projected savings live)
   - **Step 4** — a celebratory success screen that routes you to the dashboard

3. **Live dashboard** (`/dashboard`) — the simulation core:
   - A **live savings ticker** that counts up smoothly from a simulated clock
   - An animated **energy-usage chart** (last 24h / 7 days) of *typical* vs *with Renew Home*,
     with peak windows shaded
   - A **grid-events panel**: trigger a peak event and watch the system gently shift load while
     comfort stays within 1°F and you earn a reward. Events also **auto-fire** occasionally, and
     each one is logged in an event-history list with a timestamp
   - A one-tap **comfort-first override** toggle (you're always in control)
   - **Impact summary** cards + a gamified **"top X% of savers"** stat
   - A **reset** button that clears the saved session and restarts the demo

### Persistence

The "user session" (activated state, chosen brand, comfort settings, accrued savings, and event
history) is persisted to **`localStorage`**, so a refresh keeps everything. The live savings figure
is recomputed from the activation timestamp, so it stays consistent across refreshes.

---

## 🧱 Tech stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations and view transitions
- All state simulated client-side; no real API calls anywhere
- Deploy-ready for **Vercel**

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run build   # production build
npm run start   # serve the production build
```

### Deploy to Vercel

Push this folder to a Git repo and import it on [vercel.com](https://vercel.com), or run
`npx vercel`. No environment variables are required — it's entirely self-contained.

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout + SessionProvider + fonts
│   ├── page.tsx              # Landing page
│   ├── activate/page.tsx     # Activation wizard route
│   └── dashboard/page.tsx    # Live dashboard route
├── components/
│   ├── landing/              # Header, Hero, Calculator, FAQ, Explainer, …
│   ├── activation/           # ActivationWizard (4 steps)
│   ├── dashboard/            # SavingsTicker, UsageChart, GridEventsPanel, …
│   └── ui/                   # Button, Logo, AnimatedNumber, icons
└── lib/                      # ← all mock data & simulation logic lives here
    ├── config.ts             # Tunable knobs (rates, demo speed, reward range…)
    ├── calc.ts               # Savings/CO₂/trees formulas + formatting
    ├── mockData.ts           # Chart curves + grid-event generation
    ├── brands.ts             # Compatible thermostat brands
    ├── session.ts            # localStorage load/save + default session
    ├── useSession.tsx        # React context for the simulated session
    └── useLiveSavings.ts     # The live ticker hook
```

## 🎛️ Tweaking the simulation

All the numbers are isolated so they're easy to change:

- **`src/lib/config.ts`** — savings rate, CO₂ factors, demo ticker speed, reward range, auto-event
  cadence, and the "top X% of savers" band.
- **`src/lib/calc.ts`** — the indicative formulas:
  ```
  annual_savings ≈ monthly_bill × 12 × 0.06 × (style multiplier)
  co2_kg         ≈ annual_savings × 3.4
  trees          ≈ co2_kg / 21
  ```
- **`src/lib/mockData.ts`** — the typical/optimized energy curves and grid-event flavor text.

---

Made as a design + interaction prototype. Enjoy the (simulated) savings. 🌍
