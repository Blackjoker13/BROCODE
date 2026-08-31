# HOBIE — Brutalist Streetwear Hero

Next.js 14 (App Router) + React Three Fiber + Tailwind CSS. Full-screen 3D
t-shirt hero with drag-to-rotate, auto-spin, film grain, and a brutalist UI.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production

```bash
npm run build
npm start
```

## Structure

| Path | Role |
|---|---|
| `app/page.jsx` | Renders `<HeroSection />` |
| `app/layout.jsx` | Metadata, fonts, global CSS |
| `app/globals.css` | Tailwind + grain keyframes |
| `components/hero/HeroSection.jsx` | Layers 0–20: background type, grain, canvas mount, UI, cart state |
| `components/hero/Scene.jsx` | `<Canvas>` — lighting, `Environment preset="city"`, `OrbitControls`, contact shadows, interaction-aware auto-rotate |
| `components/hero/TshirtModel.jsx` | `useGLTF` loader, auto-centers geometry, idle float |
| `public/tshirt.glb` | Draco-compressed model (8 MB, from the original 31 MB `brocode_Tshirt.glb`) |
| `public/draco/` | Self-hosted Draco decoder (no CDN dependency) |

## Troubleshooting

**`Error: Cannot find module './819.js'`** (or similar numbered chunk)

The `.next` build cache got corrupted. Causes, in order of likelihood:

1. `npm run build` was run while `npm run dev` was still running — they share
   `.next` and clobber each other. Never run both at once.
2. This folder is inside **OneDrive**, which syncs `.next/` while Next.js is
   writing chunk files into it. Best fix: move the project outside OneDrive
   (e.g. `C:\dev\jadu`), or pause OneDrive sync while developing.

Recovery:

```bash
# stop the dev server first, then:
rmdir /s /q .next
npm run dev
```

## Swapping the model

Drop a new `.glb` at the project root and run:

```bash
npm run compress-model
```

That writes a Draco-compressed `public/tshirt.glb`. If your model is **not**
Draco-compressed, change `useGLTF(MODEL_URL, DRACO_PATH)` to `useGLTF(MODEL_URL)`
in `components/hero/TshirtModel.jsx`.

Tune `scale` / `position` on `<TshirtModel>` and `camera.fov` in
`components/hero/Scene.jsx` to fit the shirt inside the background wordmark.
