import type { IconName } from "./icons";

/* Layout: the grid runs on 8px rows. `rows` is the tile height in rows (tile height = rows * 8 - 16),
   `cols` is how many columns it spans in the three-column layout. Each category is ordered so the
   columns end level, like a pinboard. */
export type SectionMeta = {
  id: string; title: string; desc: string; icon: IconName; cat: string;
  rows: number; cols?: 1 | 2 | 3; variants?: string[]; prompt: string;
};
export type Category = { id: string; title: string; line: string; icon: IconName };

export const CATEGORIES: Category[] = [
  { id: "actions", title: "Actions", line: "Things you press.", icon: "cursor-01" },
  { id: "inputs", title: "Inputs", line: "Things you type, pick and drop.", icon: "input-text" },
  { id: "navigation", title: "Navigation", line: "Ways to get somewhere.", icon: "layout-01" },
  { id: "overlays", title: "Overlays", line: "Things that appear on top.", icon: "layers-01" },
  { id: "data", title: "Data", line: "Numbers, lists and people.", icon: "chart-bar-line" },
  { id: "motion", title: "Motion", line: "Small moments of movement.", icon: "sparkles" },
];

const P = (s: string) => s + " Use React with TypeScript and Tailwind CSS, no extra libraries. Use CSS variables for colors so it works in light and dark themes. Keep corners at 8 to 14px, borders at 1px, and transitions between 200 and 700ms with a soft ease-out.";

export const SECTIONS: SectionMeta[] = [
  /* Actions — c1-2: Button, Dock · c3: Like, Magnetic */
  { id: "button", cat: "actions", title: "Button", icon: "cursor-01", rows: 47, cols: 2, variants: ["Styles", "Async", "Hold", "Copy"],
    desc: "Five styles, an async state and press-and-hold.",
    prompt: P("Build a button set: primary, secondary, ghost, accent and danger styles in three sizes, plus an icon-only button and a loading state. Add an async deploy button that morphs from Deploy to a spinner to a green Live state, a hold-to-delete button that fills while held and shows an Undo state inside the button area, and a copy-command field whose copy icon morphs into a check.") },
  { id: "like", cat: "actions", title: "Like", icon: "favourite", rows: 39, variants: ["Heart", "Actions"],
    desc: "A heart that bursts, with a rolling count.",
    prompt: P("Build a like button: a large rounded-square button with a heart that fills and pops when pressed and throws twelve small particles outward, and a count whose digits roll like a slot machine. Add a second variant: a post card with like, repost and save actions, each toggling color and rolling its own count.") },
  { id: "dock", cat: "actions", title: "Dock", icon: "grid-view", rows: 37, cols: 2,
    desc: "Icons that swell as you sweep past.",
    prompt: P("Build an app dock: seven rounded app icons in a frosted bar. As the pointer moves along the dock, each icon scales up based on its distance to the pointer (max 1.75x within 130px). Show the app name above the hovered icon, bounce an icon when clicked, and mark opened apps with a dot underneath.") },
  { id: "magnetic", cat: "actions", title: "Magnetic", icon: "magic-wand-01", rows: 45, variants: ["Buttons", "Icons"],
    desc: "Buttons that lean toward your cursor.",
    prompt: P("Build a magnetic button wrapper that translates its child toward the pointer by a strength factor while hovering and springs back with an overshoot easing on leave. Nest a second, weaker magnetic layer for the label so it lags slightly. Show a primary and secondary button, and a row of four icon buttons.") },

  /* Inputs — full: Keyboard · c1: Input, Calendar · c2: Toggle, Dropzone · c3: Select, Rating */
  { id: "keyboard", cat: "inputs", title: "Keyboard", icon: "keyboard", rows: 52, cols: 3,
    desc: "Type anywhere. The keys light up.",
    prompt: P("Build an on-screen keyboard that mirrors real key presses: listen for keydown and keyup on the document and light the matching key by its KeyboardEvent.code. Keys can also be pressed with the mouse. Show the last 28 typed characters above it with a blinking caret, and tint each key by how often it has been pressed.") },
  { id: "input", cat: "inputs", title: "Input", icon: "input-text", rows: 58, variants: ["Fields", "Password", "Code", "Slider"],
    desc: "Live validation, strength meter, one-time code, sliders.",
    prompt: P("Build four input patterns: an email field that shows a check when valid and an error after blur, a username field with a debounced availability check; a password field with show/hide, a four-segment strength meter and a checklist of rules; a six-digit one-time code with auto-advance, paste support, a shake on a wrong code and a verified state; and a custom range slider plus a stepped seat picker that updates a price.") },
  { id: "toggle", cat: "inputs", title: "Toggle", icon: "toggle-on", rows: 54, variants: ["Switch", "Checkbox", "Radio"],
    desc: "Switches, nested checkboxes, radio cards.",
    prompt: P("Build three choice controls: a settings list where each row has a title, a description and a squared switch; a parent checkbox with four children that shows an indeterminate state when only some are checked; and radio cards for plan selection with a soft ring on the selected card and a price on the right.") },
  { id: "select", cat: "inputs", title: "Select", icon: "dropdown", rows: 66, variants: ["Select", "Combobox", "Multiple"],
    desc: "Keyboard listbox, filter combobox, multi-select.",
    prompt: P("Build a custom listbox with a trigger button and a popover list that supports arrow keys, Enter and Escape and opens on the current value. Add a searchable combobox that highlights the matching part of each option, and a multi-select that shows chosen items as small removable chips inside the trigger.") },
  { id: "dropzone", cat: "inputs", title: "Dropzone", icon: "download-01", rows: 66,
    desc: "Drop real files on it. Nothing leaves your browser.",
    prompt: P("Build a file dropzone: a dashed area that lifts and tints while files are dragged over it, accepts drops and clicks (hidden file input), and lists the newest four files with name, a progress bar that fills to 100% and the formatted size. Files never leave the browser.") },
  { id: "calendar", cat: "inputs", title: "Calendar", icon: "calendar-01", rows: 62, variants: ["Single", "Range"],
    desc: "Pick a single day or drag out a range.",
    prompt: P("Build a month calendar with weeks starting on Monday, previous and next month buttons, and today marked with a dot. In single mode clicking selects one day and shows it in words below. In range mode the first click sets the start, hovering previews the range and the second click sets the end, with the number of nights shown below.") },
  { id: "rating", cat: "inputs", title: "Rating", icon: "star", rows: 54, variants: ["Stars", "Reactions"],
    desc: "Stars with hover preview, and reaction counters.",
    prompt: P("Build a five-star rating with hover preview, a pop when a star is chosen and a label that changes with the score. Add a reactions variant: four reaction buttons, each with an icon, a label and a rolling count that goes up by one when you react.") },

  /* Navigation — c1-2: Command, Stepper · c3: Menu, Tabs */
  { id: "command", cat: "navigation", title: "Command", icon: "command", rows: 62, cols: 2,
    desc: "Search every action from one box.",
    prompt: P("Build a command menu: a search input over a grouped list of actions with icons and keyboard hints. Arrow keys move the highlight, Enter runs the action, and the result of the last action is shown in a status line at the bottom of the menu instead of a toast.") },
  { id: "menu", cat: "navigation", title: "Menu", icon: "menu-01", rows: 56, variants: ["Dropdown", "Context"],
    desc: "Dropdown and right-click menus.",
    prompt: P("Build an account dropdown with an avatar trigger, an email label, items with keyboard hints and a danger sign-out item; arrow keys move focus and Escape closes. Add a right-click context menu that opens at the cursor inside a dashed area. The chosen action is written into the component itself.") },
  { id: "tabs", cat: "navigation", title: "Tabs", icon: "layout-01", rows: 50, variants: ["Segmented", "Underline", "Vertical"],
    desc: "Segmented, underline and vertical.",
    prompt: P("Build three tab styles that all use a sliding indicator measured from the active tab: a segmented control that changes a number which counts up to its new value, underline tabs with arrow-key support and panels that fade in, and vertical settings tabs with a sliding background and accent bar.") },
  { id: "stepper", cat: "navigation", title: "Stepper", icon: "arrow-right-01", rows: 44, cols: 2,
    desc: "A multi-step flow with a filling track.",
    prompt: P("Build a four-step onboarding stepper: numbered squares connected by a track that fills as you advance, completed steps showing a check, a content area per step (including an editable workspace name) and Back / Continue / Start over buttons.") },

  /* Overlays — c1-2: Accordion · c1: Dialog · c2: Toast · c3: Feedback, Popover */
  { id: "accordion", cat: "overlays", title: "Accordion", icon: "menu-collapse", rows: 52, cols: 2,
    desc: "Soft height transitions.",
    prompt: P("Build an FAQ accordion where one item is open at a time. Animate height with a grid-template-rows transition from 0fr to 1fr, fade the answer in, and turn a plus into a minus by collapsing its vertical bar.") },
  { id: "feedback", cat: "overlays", title: "Feedback", icon: "alert-circle", rows: 60, variants: ["Alerts", "Progress", "Skeleton", "Empty"],
    desc: "Alerts, uploads, skeletons, empty states.",
    prompt: P("Build four feedback states: dismissible alerts with a colored edge (success, warning, error, info) and a way to bring them back; an upload list with progress bars that turn green with a check when done; a skeleton card that shimmers then fades into real content; and an empty state whose button fills the list.") },
  { id: "dialog", cat: "overlays", title: "Dialog", icon: "layers-01", rows: 58, variants: ["Modal", "Drawer", "Confirm"],
    desc: "Modal, drawer and type-to-confirm, inside the frame.",
    prompt: P("Build a dialog set that opens inside its own container rather than the whole page: an invite modal with a textarea, a drawer that slides in from the right with profile fields, and a destructive confirm that only enables Delete once the project name is typed. After each action the container shows what happened.") },
  { id: "toast", cat: "overlays", title: "Toast", icon: "notification-01", rows: 58,
    desc: "Stacked notifications inside their own frame.",
    prompt: P("Build a toast stack contained in a panel: buttons fire success, error, undo and promise toasts that stack with scale and offset, spread out on hover, dismiss after four seconds, support an Undo action and update a loading toast in place when the promise resolves.") },
  { id: "popover", cat: "overlays", title: "Tooltip & Popover", icon: "information-circle", rows: 50, variants: ["Tooltip", "Popover"],
    desc: "Hints on hover, small forms on click.",
    prompt: P("Build a floating toolbar of icon buttons with delayed tooltips that show a label and a shortcut; clicking a tool writes the action into a status line. Add a feedback popover anchored under a button, with an arrow, four mood choices, a textarea and a send button that turns the popover into a thank-you state.") },

  /* Data — c1-2: Chart, Card · c3: Chat, Avatars, Timeline · c1: Ticker · c2: Ring · full: Table */
  { id: "chart", cat: "data", title: "Chart", icon: "chart-bar-line", rows: 57, cols: 2, variants: ["Bars", "Area", "Donut"],
    desc: "Bars, area and donut. Hover everything.",
    prompt: P("Build three SVG charts with no chart library: stacked bars with a hover column and a tooltip listing each series, an area chart comparing this year with last year with a crosshair and tooltip, and a donut whose hovered segment thickens and shows its share in the middle.") },
  { id: "chat", cat: "data", title: "Chat", icon: "mail-01", rows: 73,
    desc: "Bubbles with a typing indicator. Say something.",
    prompt: P("Build a chat panel: a header with avatar and online state, message bubbles (yours dark on the right, theirs light on the left) that blur in, a typing indicator of three bouncing dots, an input with a send button, and a short reply that arrives after you send.") },
  { id: "card", cat: "data", title: "Card", icon: "credit-card", rows: 56, cols: 2, variants: ["Metric", "Pricing", "Integration"],
    desc: "Crosshair metric, pricing switch, integrations.",
    prompt: P("Build three cards: a revenue metric with an area sparkline where moving the pointer shows a crosshair and updates the headline number and change; a pricing card with a monthly/yearly switch that counts the price up or down; and three integration cards with a switch that shows connecting, then connected.") },
  { id: "avatars", cat: "data", title: "Avatars", icon: "user-multiple-02", rows: 36,
    desc: "A stack that fans out on hover.",
    prompt: P("Build an avatar stack: overlapping circular avatars with initials that spread apart on hover, lift individually with a name tooltip, show online dots, and a +N button that reveals the rest.") },
  { id: "timeline", cat: "data", title: "Timeline", icon: "clock-01", rows: 48, variants: ["Activity", "Deploy log"],
    desc: "Activity feed and a streaming deploy log.",
    prompt: P("Build an activity timeline with avatars on a vertical line and a button that pushes a new event to the top, plus a deploy log that streams lines one by one with checkmarks, a running timer and a final Ready state with a redeploy button.") },
  { id: "ticker", cat: "data", title: "Number ticker", icon: "analytics-01", rows: 44, variants: ["Counter", "Revenue", "Clock"],
    desc: "Digits that roll like a slot machine.",
    prompt: P("Build a number ticker where each digit is a vertical strip of 0–9 that translates to its value, so changes roll. Show a counter with step buttons, a revenue figure with a button that adds a sale and shows it inline, and a live clock that ticks every second.") },
  { id: "ring", cat: "data", title: "Ring", icon: "gauge", rows: 44, variants: ["Timer", "Goals"],
    desc: "A focus timer and stacked goal rings.",
    prompt: P("Build progress rings with SVG stroke-dashoffset: a focus timer with 1, 5 and 25 minute presets, start, pause and reset, and three concentric goal rings that animate in when visible and shuffle when clicked.") },
  { id: "table", cat: "data", title: "Table", icon: "table-01", rows: 72, cols: 3,
    desc: "Sort, filter, select, act in bulk.",
    prompt: P("Build a members table: search filter, sortable Name / Role / Last seen headers with arrows, row checkboxes with an indeterminate header checkbox, a bulk bar that replaces the toolbar with Export and Remove, Undo after removing, status dots and pagination.") },

  /* Motion — c1: Tilt, Scramble · c2: Reveal, Compare · c3: Sortable, Spotlight · full: Marquee */
  { id: "tilt", cat: "motion", title: "Tilt", icon: "credit-card", rows: 48,
    desc: "A card with weight. Click to flip it.",
    prompt: P("Build a 3D tilt card: on pointer move rotate up to 12 degrees toward the cursor with a soft glare that follows it, spring back on leave, and flip to the back face on click using backface-visibility.") },
  { id: "reveal", cat: "motion", title: "Blur reveal", icon: "view", rows: 52, variants: ["Words", "Letters", "Lines"],
    desc: "Text that arrives out of focus.",
    prompt: P("Build a blur reveal for text: split by word, letter or line, and transition each piece from opacity 0, 8px blur and a small upward offset to sharp, with a staggered delay. Add a Replay button.") },
  { id: "sortable", cat: "motion", title: "Sortable", icon: "menu-01", rows: 50,
    desc: "Drag rows into a new order.",
    prompt: P("Build a sortable task list with pointer events only: drag a row by its handle, other rows slide out of the way to show where it will land, and the order commits on release. Each row has a checkbox that strikes the task through.") },
  { id: "scramble", cat: "motion", title: "Scramble", icon: "source-code", rows: 48, variants: ["Hover", "On view"],
    desc: "Words that decode under your cursor.",
    prompt: P("Build a text scramble effect: on hover (or when scrolled into view) every character cycles through random glyphs and settles left to right over about 700ms using requestAnimationFrame.") },
  { id: "spotlight", cat: "motion", title: "Spotlight", icon: "sparkles", rows: 46, variants: ["Cards", "Beam"],
    desc: "Light that follows the pointer.",
    prompt: P("Build spotlight cards whose background shows a soft radial light at the pointer position using CSS variables set on pointer move, and a card with a slowly rotating conic-gradient border beam.") },
  { id: "compare", cat: "motion", title: "Compare", icon: "view", rows: 44,
    desc: "Drag the handle between before and after.",
    prompt: P("Build a before/after comparison: two stacked layers where the top one is clipped with clip-path inset to the handle position. Drag anywhere to move the handle; arrow keys move it by 5%.") },
  { id: "marquee", cat: "motion", title: "Marquee", icon: "arrow-right-01", rows: 36, cols: 3,
    desc: "Endless rows that pause when you hover.",
    prompt: P("Build an infinite marquee: duplicate the row, translate it from 0 to -100% in a linear loop, fade both edges with a mask, run a second row in reverse, and pause on hover.") },
];

export const PAGES: { href: string; title: string; desc: string; icon: IconName }[] = [
  { href: "/dashboard", title: "Vigil", desc: "Monitoring dashboard", icon: "grid-view" },
  { href: "/landing/meridian", title: "Meridian", desc: "SaaS landing page", icon: "rocket-01" },
  { href: "/landing/fieldnotes", title: "Fieldnotes", desc: "Newsletter landing page", icon: "mail-01" },
];

export const indexOf = (id: string) => SECTIONS.findIndex(s => s.id === id);
