/** @type {import('tailwindcss').Config} */

/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Slate", light + dark
 * ─────────────────────────────────────────────────────────────────────────────
 *  This file maps semantic token NAMES to CSS custom properties. The raw values
 *  live in src/index.css, once per theme (:root = light, html.dark = dark).
 *
 *  Because every token resolves through a variable, switching themes is a single
 *  class on <html> — no component has to know a theme exists. Component styling
 *  lives in src/styles/theme.ts, which composes these names into categories
 *  (text, buttons, inputs, sliders, ...).
 *
 *  To reskin the app, change the channels in src/index.css and nothing else.
 *  Never write a bare Tailwind palette class (bg-gray-800, text-blue-400) in a
 *  component — those bypass the theme and can't be reskinned or darkened.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Token reference that still honours Tailwind's `/opacity` modifiers. */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Backgrounds. Ordering by elevation, not by lightness — in dark mode
         * "raised" is lighter, in light mode it is whiter. */
        surface: {
          DEFAULT: token('surface'), // inputs, cards, the raised things you interact with
          panel: token('surface-panel'), // sidebars, headers, toolbars
          sunken: token('surface-sunken'), // the app background behind panels
          hover: token('surface-hover'), // hover state for surface/panel items
          active: token('surface-active'), // pressed / selected-but-not-accented
        },

        /* Borders and separators */
        edge: {
          DEFAULT: token('edge'), // standard panel + input border
          strong: token('edge-strong'), // input borders that need to read as editable
          subtle: token('edge-subtle'), // table row separators, faint internal rules
        },

        /* Text. `content` is the ink scale; contrast drops as you go down.
         * Every value clears WCAG AA against every surface above, both themes. */
        content: {
          DEFAULT: token('content'), // primary text, values, headings
          muted: token('content-muted'), // labels, secondary text
          subtle: token('content-subtle'), // hints, metadata, axis labels
          faint: token('content-faint'), // disabled text, placeholders
          inverse: token('content-inverse'), // text on a content-coloured fill
        },

        /* The one accent hue: steel. Interactive + selected states. */
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          active: token('accent-active'),
          soft: token('accent-soft'), // tinted fill behind selected rows
          subtle: token('accent-subtle'), // faintest tint, hover on selected
          on: token('accent-on'), // text/icons on top of accent
        },

        /* Status. Separate from the accent, and never used decoratively. */
        positive: {
          DEFAULT: token('positive'),
          hover: token('positive-hover'),
          soft: token('positive-soft'),
          on: token('positive-on'),
        },
        caution: {
          DEFAULT: token('caution'),
          hover: token('caution-hover'),
          soft: token('caution-soft'),
          on: token('caution-on'),
        },
        critical: {
          DEFAULT: token('critical'),
          hover: token('critical-hover'),
          soft: token('critical-soft'),
          on: token('critical-on'),
        },

        /* Data-visualisation colours. Roles, not hues — see plotColors /
         * plotColorsDark in src/styles/theme.ts for the canvas-side mirrors. */
        data: {
          primary: token('data-primary'), // left axis series (exit speed)
          primaryAlt: token('data-primary-alt'), // second left series (high arc)
          secondary: token('data-secondary'), // right axis series (exit angle)
          optimal: token('data-optimal'), // optimal / best-MOE trajectory
          extreme: token('data-extreme'), // lowest-speed trajectory
          goal: token('data-goal'), // goal planes, meterstick
          grid: token('data-grid'),
          axis: token('data-axis'),
        },

        /* The BrainSTEM wordmark. Fixed identity hues, lifted in dark mode.
         * Never reuse these as UI colours. */
        brand: {
          blue: token('brand-blue'),
          green: token('brand-green'),
          red: token('brand-red'),
          gold: token('brand-gold'),
        },

        /* The veil behind a modal. Always ink, never the text colour. */
        scrim: token('scrim'),

        /* The video stage — true black in both themes, because the letterbox
         * bars beside the footage must read as "outside the frame". */
        stage: token('stage'),

        /* UI drawn ON the footage. Theme-independent: the backdrop is video,
         * which doesn't lighten when the app does. */
        video: {
          ink: token('video-ink'),
          accent: token('video-accent'),
        },
      },

      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Consolas',
          'Cascadia Mono',
          'Menlo',
          'monospace',
        ],
      },

      boxShadow: {
        /* Elevation. The shadow ink is a token too, so dark mode drops to true
         * black and keeps its depth instead of going grey and muddy. */
        control: '0 1px 1px rgb(var(--c-shadow) / var(--shadow-alpha-1))',
        raised:
          '0 1px 2px rgb(var(--c-shadow) / var(--shadow-alpha-2)), 0 1px 3px rgb(var(--c-shadow) / var(--shadow-alpha-1))',
        overlay:
          '0 4px 12px rgb(var(--c-shadow) / var(--shadow-alpha-3)), 0 12px 32px -8px rgb(var(--c-shadow) / var(--shadow-alpha-4))',
      },
    },
  },
  plugins: [],
};
