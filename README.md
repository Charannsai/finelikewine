# FineLikeWine

An open-source library of fine, simple, modern UI components, pages and landing designs. Warm neutrals, fine borders, tight spacing.

## Stack

Next.js (App Router), TypeScript and Tailwind CSS. No component runtime dependencies.

## Structure

```
app/                      routes
  page.tsx                library showcase (all 13 sections)
  dashboard/              Vigil dashboard demo
  landing/meridian/       SaaS landing design
  landing/fieldnotes/     newsletter landing design
components/
  ui.tsx                  the component library (client components)
  icons.tsx               80 Hugeicons as React components
  chrome.tsx              sidebar, topbar, command palette shell
public/
  brand/                  tile logo (SVG light/dark, PNG favicon/touch)
  icons/                  icon SVG files + Hugeicons MIT notice
```

## Develop

```
npm install
npm run dev
```

## Icons

All icons come from the free [Hugeicons](https://hugeicons.com) set: stroke rounded, 1.5px on a 24px grid, currentColor. MIT licensed; the notice ships in `public/icons/LICENSE.md`.

## Brand

The tile logo lives in `public/brand/`.

## License

License to be chosen by the author before the first release.
