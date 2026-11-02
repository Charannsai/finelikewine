<p align="center">
  <img src="public/brand/icon-180.png" width="72" height="72" alt="FineLikeWine logo" />
</p>

<h1 align="center">FineLikeWine</h1>

<p align="center">
  Interface components for Next.js and Tailwind. Each one is a single file you copy into your app.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-722E3F" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-111" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-111" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind-4-111" alt="Tailwind CSS 4" />
</p>

---

FineLikeWine is not a package you install. It is a set of 35 components, each written as one
self-contained React file. Run the site, try a component, then copy its file (or the prompt that
builds it) into your own project and change whatever you like.

- **35 components** across actions, inputs, navigation, overlays, data and motion
- **Live on one page.** Every tile is the real component, with all its variants
- **No runtime dependencies** beyond React and Tailwind
- **Light and dark themes** from a single set of CSS variables
- **Keyboard friendly.** Menus, listboxes, tabs and dialogs work without a mouse
- **Three full page designs**: a monitoring dashboard and two landing pages

## Quick start

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/Charannsai/finelikewine.git
cd finelikewine
npm install
npm run dev
```

Open http://localhost:3000.

## Using a component in your project

1. **Add the theme tokens.** Copy the `:root`, `[data-theme="dark"]` and `@theme inline` blocks from
   [`app/globals.css`](app/globals.css) into your global stylesheet. They define the colors every component
   uses (`bg-surface`, `text-ink`, `border-line`, `bg-wine` and so on). You only do this once.
2. **Copy the file.** Take any file from [`components/library/`](components/library), or use the **Code**
   button on the site, which copies the same file.
3. **Render it.** Each file has a default export that takes an optional `variant` prop, and most also
   export the reusable piece on its own (for example `Listbox`, `Switch`, `Tooltip` or `Marquee`).

```tsx
import SelectDemo, { Listbox } from "@/components/select";

<SelectDemo variant="Combobox" />
```

Prefer to generate it yourself? The **Prompt** button copies a description of the component that you
can hand to an AI coding tool.

## Components

| Category | Components |
| --- | --- |
| Actions | Button, Like, Dock, Magnetic |
| Inputs | Keyboard, Input, Toggle, Select, Dropzone, Calendar, Rating |
| Navigation | Command, Menu, Tabs, Stepper |
| Overlays | Accordion, Feedback, Dialog, Toast, Tooltip & Popover |
| Data | Chart, Chat, Card, Avatars, Timeline, Number ticker, Ring, Table |
| Motion | Tilt, Blur reveal, Sortable, Scramble, Spotlight, Compare, Marquee |

## Project structure

```
app/
  (library)/            the component catalogue at /
  dashboard/            Vigil, a monitoring dashboard
  landing/meridian/     a SaaS landing page
  landing/fieldnotes/   a newsletter landing page
  globals.css           theme tokens, light and dark
components/
  library/              the 35 standalone components (one file each)
  registry.ts           names, categories, grid sizes and prompts
  catalog.tsx           the pinboard grid
  section.tsx           tile and full-screen inspector
  explorer.tsx          sidebar and page shell
  motion.tsx            blur reveal and small motion helpers used by the site
  ui.tsx                shared primitives used by the site and page designs
  icons.tsx             Hugeicons used by the site
public/
  brand/                logo and app icons
  icons/                Hugeicons license
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting |
| `npm run check` | Lint and type-check together |

## Contributing

Bug reports, fixes and new components are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening
a pull request, and please follow the [code of conduct](CODE_OF_CONDUCT.md). To report a security issue,
see [SECURITY.md](SECURITY.md).

## Credits

Icons on the site come from the free [Hugeicons](https://hugeicons.com) set, used under the MIT license
(see [`public/icons/LICENSE.md`](public/icons/LICENSE.md)). Fonts are Geist and Geist Mono, under the
SIL Open Font License.

## License

[MIT](LICENSE) © 2026 Charannsai and FineLikeWine contributors.
