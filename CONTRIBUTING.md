# Contributing to FineLikeWine

Thanks for helping. This guide covers how to set up the project, what a good component looks like here,
and how to open a pull request.

## Setup

```bash
git clone https://github.com/Charannsai/finelikewine.git
cd finelikewine
npm install
npm run dev
```

Before you push, run:

```bash
npm run check
npm run build
```

## Ways to help

- **Report a bug.** Open an issue with the component name, what you did, what you expected and what
  happened. Note your browser and whether you were in light or dark mode.
- **Fix something.** Small fixes can go straight to a pull request.
- **Propose a component.** Open a feature request first so we can agree on scope before you build it.

## Adding or changing a component

Every component lives in one file under `components/library/`. A few rules keep them easy to copy:

1. **Self-contained.** Import only from `react`. No imports from `@/components/ui` or other library
   files. Inline any icons as small SVG paths and put any keyframes in a `<style>` tag inside the
   component.
2. **Theme tokens only.** Use the color tokens from `app/globals.css` (`bg-surface`, `text-ink`,
   `border-line`, `bg-wine`, `text-green` and so on) or CSS variables like `var(--accent)`. Never
   hard-code a light-only or dark-only color for UI chrome. Check both themes.
3. **Default export with an optional `variant` prop.** Variants are listed in `components/registry.ts`.
4. **Feedback stays inside the component.** When someone presses something, the change shows in the
   component itself. Overlays such as dialogs and toasts render inside the component's own frame.
5. **Keyboard and screen readers.** Buttons are buttons, toggles expose `role="switch"` or
   `aria-checked`, menus move focus with the arrow keys, and Escape closes things.
6. **Calm motion.** Transitions between 200 and 700ms with a soft ease-out. Nothing loops fast or
   flashes.
7. **No clock or random values during render.** Read `new Date()` or `Math.random()` in an effect or
   an event handler, never while rendering. The page is prerendered.
8. **Header comment.** Start the file with the same short comment block the other files use: name,
   dependencies and variants.

Then register it in `components/registry.ts` with a title, description, category, grid size (`rows`
and `cols`), variants and a prompt, and add the import in `components/catalog.tsx`.

## Pull requests

- Keep each pull request to one change.
- Describe what changed and why, and add a screenshot or short clip for anything visual.
- Make sure `npm run check` and `npm run build` pass.
- By contributing you agree that your work is released under the [MIT license](LICENSE).

## Code of conduct

This project follows the [code of conduct](CODE_OF_CONDUCT.md). Please read it before taking part.
