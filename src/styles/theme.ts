/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE STYLE GUIDE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every visual UI element in this app is described here, exactly once, grouped
 *  by what kind of thing it is. Components import from this file and never write
 *  their own colours, sizes, or spacing for these elements.
 *
 *  ── How to use it ────────────────────────────────────────────────────────────
 *
 *    import { text, button, input } from '../styles/theme';
 *
 *    <h3 className={text.subsectionTitle}>Physics model</h3>
 *    <button className={button.primary}>Generate</button>
 *    <input className={input.numeric} />
 *
 *  Stateful categories are functions, because the state changes the classes:
 *
 *    <button className={tab.panel(isActive)}>Annotation</button>
 *    <div className={table.row(isInvalid ? 'invalid' : 'default')} />
 *
 *  ── How to extend it ─────────────────────────────────────────────────────────
 *
 *  1. Look for an existing category first. A "toolbar icon button" is
 *     `button.icon`, not a new one-off. A "small grey caption" is `text.meta`.
 *     Reusing a near-match is always better than adding a near-duplicate — that
 *     is how the old codebase ended up with nine slightly different greys.
 *  2. If nothing fits, add a NEW NAMED ENTRY to the category it belongs to.
 *     Give it a comment saying when to pick it over its siblings.
 *  3. If it isn't a member of any category, add a new category with a banner
 *     comment. Categories are kinds of element, not places in the app —
 *     `button`, not `sidebarButton`.
 *  4. Colours come from tailwind.config.js only. If you need a colour that
 *     isn't there, add a semantic token there first (`caution`, not `amber-500`).
 *
 *  ── Conventions the whole app follows ────────────────────────────────────────
 *
 *    Radius     rounded-md on controls · rounded-lg on cards & dialogs
 *    Focus      always visible, always `focusRing` — never `outline-none` alone
 *    Numbers    always `text.mono` (tabular figures line up in columns)
 *    Disabled   always `disabledState` (never a bespoke opacity)
 *    Status     positive / caution / critical. Never the accent for meaning.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES — the shared fragments every category is built from
   ═══════════════════════════════════════════════════════════════════════════ */

/** Keyboard focus. Applied to everything interactive, no exceptions. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface';

/** Focus treatment for text fields, where a ring would fight the border. */
export const focusField =
  'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20';

/** The single disabled treatment. */
export const disabledState = 'disabled:opacity-40 disabled:cursor-not-allowed';

/** The single transition. Colour-only, so layout never animates. */
export const transition = 'transition-colors duration-150';

/* ═══════════════════════════════════════════════════════════════════════════
   LAYOUT — page shell, panels, sections, separators
   ═══════════════════════════════════════════════════════════════════════════ */

export const layout = {
  /** Root application shell. Owns the page background and base type. */
  appShell: 'flex flex-col h-screen bg-surface-sunken text-content font-sans overflow-hidden',

  /** Top application header holding the wordmark and page tabs. */
  headerBar: 'flex-shrink-0 bg-surface-panel border-b border-edge px-6 pt-3.5 pb-0',

  /** A left or right sidebar. Width is set by the caller (resizable). */
  panel: 'flex flex-col bg-surface-panel h-full overflow-hidden text-sm',
  /** Border side for a sidebar — pick the one facing the content area. */
  panelBorderRight: 'border-r border-edge',
  panelBorderLeft: 'border-l border-edge',

  /** The scrolling body of a panel, with the standard rhythm. */
  panelScroll: 'flex-1 overflow-y-auto p-4 space-y-5',
  /** A non-scrolling block inside a panel, separated from what follows. */
  panelBlock: 'flex-shrink-0 p-4 border-b border-edge space-y-2',
  /** A pinned footer block inside a panel (save/import actions). */
  panelFooter: 'flex-shrink-0 min-h-0 overflow-y-auto border-t border-edge p-3 space-y-1.5',
  /** Same, when the footer holds several titled subsections rather than a
   *  single stack of buttons. Never combine the two — `space-y-*` classes race. */
  panelFooterSectioned: 'flex-shrink-0 min-h-0 overflow-y-auto border-t border-edge p-3 space-y-3',

  /** The main content area between the panels. */
  contentArea: 'flex flex-1 min-w-0 min-h-0',

  /** A grouped box inside a panel — use for readouts and summaries. */
  card: 'rounded-lg border border-edge bg-surface p-3 shadow-control',
  /** Same box, but recessed rather than raised. For "computed" info. */
  cardSunken: 'rounded-lg bg-surface-hover p-3',

  /** Horizontal rule between sections inside a panel. */
  divider: 'border-t border-edge',
  /** Faint rule between rows in a dense list or table. */
  dividerSubtle: 'border-b border-edge-subtle',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT — every piece of type in the app
   ═══════════════════════════════════════════════════════════════════════════ */

export const text = {
  /** The app wordmark. One per page. */
  appTitle: 'text-xl font-bold tracking-tight text-content',

  /** Uppercase panel heading: "VIDEOS", "SIMULATION". Top level in a panel. */
  sectionTitle: 'text-xs font-semibold text-content-muted uppercase tracking-wider',
  /** Sentence-case heading one level down: "Launch conditions". */
  subsectionTitle: 'text-sm font-medium text-content-muted',
  /** The name of a specific thing: a video, a dialog subject. */
  itemTitle: 'text-base font-semibold text-content',

  /** Form label above its field. */
  label: 'text-sm text-content-muted block mb-1.5',
  /** Form label beside its field, on one line. */
  labelInline: 'text-sm font-medium text-content-muted',
  /** Label in a dense row where `labelInline` is too big. Same ink, smaller. */
  labelFine: 'text-xs font-medium text-content-muted',

  /**
   * An emphasised value inline in a sentence, at the surrounding size:
   * "currently editing <em>Trajectory 2</em>". Use `value` instead when the
   * thing being emphasised is a number.
   */
  emphasis: 'text-content font-medium',
  /** A de-emphasised inline fallback: "new trajectory", "none selected". */
  placeholder: 'text-content-faint italic',

  /** Explanatory prose. Multi-sentence instructions. */
  body: 'text-sm text-content-subtle leading-relaxed',
  /** One-line help under a control. Smaller than body. */
  hint: 'text-xs text-content-subtle leading-relaxed',
  /** Incidental metadata: filenames, counts, timestamps, axis labels. */
  meta: 'text-xs text-content-subtle',
  /** Metadata in a space too tight for `meta` — canvas legends, drag hints. */
  metaFine: 'text-[10px] leading-snug text-content-subtle',
  /** "Nothing here yet" message, centred in the space it fills. */
  empty: 'text-sm text-content-subtle text-center leading-relaxed',

  /** Any number the user compares or scans. Tabular figures. */
  mono: 'font-mono tabular-nums',
  /** A computed value being emphasised next to its label. */
  value: 'font-mono tabular-nums text-content font-semibold',

  /** Status prose. Use for the result of an action, not for decoration. */
  positive: 'text-sm text-positive',
  caution: 'text-sm text-caution',
  critical: 'text-sm text-critical',

  /** The title above a chart panel. Smaller than a subsection, same ink. */
  chartTitle: 'text-xs font-medium text-content-muted',

  /** A preformatted block — folder layouts, expected filenames. */
  pre: 'font-mono text-[10px] leading-tight text-content-subtle whitespace-pre-wrap rounded-md bg-surface-hover border border-edge p-2',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS — pick by intent, then by prominence
   ═══════════════════════════════════════════════════════════════════════════ */

const buttonBase = `inline-flex items-center justify-center gap-2 rounded-md font-medium ${transition} ${focusRing} ${disabledState}`;
const buttonPad = 'px-3 py-2 text-sm';

export const button = {
  /** The one action the user most likely wants. One per panel section. */
  primary: `${buttonBase} ${buttonPad} bg-accent text-accent-on hover:bg-accent-hover active:bg-accent-active shadow-control`,
  /** Everything else with a visible box. The default choice. */
  secondary: `${buttonBase} ${buttonPad} bg-surface text-content-muted border border-edge-strong hover:bg-surface-hover hover:text-content`,
  /** Low-prominence action in a dense toolbar. No border until hovered. */
  subtle: `${buttonBase} ${buttonPad} bg-transparent text-content-muted hover:bg-surface-hover hover:text-content`,

  /** Destructive and prominent: "Clear All". Confirm before wiring these up. */
  danger: `${buttonBase} ${buttonPad} bg-critical text-critical-on hover:bg-critical-hover shadow-control`,
  /** Destructive but routine: "Delete current point", "Clear all points". */
  dangerSubtle: `${buttonBase} ${buttonPad} bg-critical-soft text-critical border border-critical/25 hover:bg-critical hover:text-critical-on`,
  /** Completes/exports something: "Download", "Plot Ball". */
  positive: `${buttonBase} ${buttonPad} bg-positive text-positive-on hover:bg-positive-hover shadow-control`,

  /** Square icon-only button in a toolbar (video controls, panel collapse). */
  icon: `inline-flex items-center justify-center rounded-md p-1.5 bg-surface text-content-muted border border-edge hover:bg-surface-hover hover:text-content ${transition} ${focusRing} ${disabledState}`,
  /** Icon with no chrome at all — row actions revealed on hover. */
  iconGhost: `inline-flex items-center justify-center rounded p-0.5 text-content-faint hover:text-content ${transition} ${focusRing}`,
  /** Icon that deletes. Same shape as iconGhost, critical on hover. */
  iconGhostDanger: `inline-flex items-center justify-center rounded p-0.5 text-content-faint hover:text-critical ${transition} ${focusRing}`,
  /**
   * Ghost icon sitting on an accent-filled row (see list.item(true)), where the
   * normal faint grey would disappear. Inverts instead of darkening.
   */
  iconGhostInverse: `inline-flex items-center justify-center rounded p-0.5 text-accent-on/70 hover:text-accent-on hover:bg-accent-hover ${transition} ${focusRing}`,

  /**
   * A button that reports its own on/off state — "Plot Ball" / "Stop Plotting",
   * "Show simulation" / "Hide simulation". The fill is the state cue, so the
   * label is free to describe the action rather than the state.
   */
  toggle: (active: boolean) =>
    `${buttonBase} ${buttonPad} ${
      active
        ? 'bg-accent text-accent-on hover:bg-accent-hover shadow-control'
        : 'bg-surface text-content-muted border border-edge-strong hover:bg-surface-hover hover:text-content'
    }`,

  /** Modifier: make any variant fill its container. */
  block: 'w-full',
  /**
   * Size modifiers. These carry `!` because they intentionally override the
   * padding and font size already set by the variant, and Tailwind resolves
   * same-property conflicts by stylesheet order rather than by the order classes
   * appear in the attribute — without `!`, `px-2` would silently lose to `px-3`.
   */
  compact: '!px-2 !py-1 !text-xs !gap-1.5',
  large: '!px-4 !py-2.5 !text-sm',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   INPUTS — text fields and numeric fields
   ═══════════════════════════════════════════════════════════════════════════ */

const inputBase = `bg-surface border border-edge-strong rounded-md text-content placeholder:text-content-faint ${transition} ${focusField} ${disabledState}`;

export const input = {
  /** Full-width text field with a label above it. */
  text: `${inputBase} w-full text-sm px-3 py-2`,
  /** Text field sitting inline beside its label. */
  compact: `${inputBase} text-sm px-2 py-1.5`,
  /** A number the user types. Right-aligned so digits line up. */
  numeric: `${inputBase} w-20 text-sm text-right px-2 py-1.5 font-mono tabular-nums`,
  /** Numeric field in a dense row of them (tuning weights). Centred. */
  numericTight: `${inputBase} w-12 h-6 text-xs text-center px-1 py-0.5 font-mono tabular-nums`,
  /** Editing a value in place in a table cell — underline only, no box. */
  inlineCell: `w-full min-w-0 bg-transparent border-0 border-b border-accent text-accent text-sm font-mono tabular-nums focus:outline-none`,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   CONTROLS — checkboxes, segmented toggles, sliders
   ═══════════════════════════════════════════════════════════════════════════ */

const checkboxBase = `h-4 w-4 shrink-0 rounded border-edge-strong bg-surface cursor-pointer ${focusRing} disabled:cursor-not-allowed disabled:opacity-40`;

export const control = {
  /** Standard checkbox. */
  checkbox: `${checkboxBase} text-accent`,
  /** Checkbox for a toggle that reveals optimal//successful data. */
  checkboxPositive: `${checkboxBase} text-positive`,
  /** The label wrapper that makes the whole row clickable. */
  checkboxRow: 'flex items-center gap-2 select-none cursor-pointer',
  checkboxRowDisabled: 'flex items-center gap-2 select-none opacity-40 cursor-not-allowed',

  /** Segmented toggle: 2–3 mutually exclusive views of the same data. */
  segmentedGroup: 'inline-flex rounded-md border border-edge bg-surface-hover p-0.5',
  segmentedItem: (active: boolean) =>
    `h-7 px-3 text-xs font-medium rounded ${transition} ${focusRing} disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'bg-surface text-content shadow-control'
        : 'text-content-subtle hover:text-content'
    }`,

  /** Native range input. Use when a plain value slider will do. */
  sliderNative: `w-full h-1.5 accent-accent cursor-pointer ${focusRing} disabled:cursor-not-allowed disabled:opacity-40`,

  /** Custom slider, for dual-thumb ranges the native input can't express. */
  sliderTrack: 'relative h-1.5 rounded-full bg-edge-strong',
  sliderFill: 'absolute inset-y-0 rounded-full bg-accent',
  sliderThumb:
    'absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-surface border-2 border-accent shadow-control',

  /** The video scrubber. Taller than a slider because it is a primary control. */
  scrubTrack: 'relative h-2.5 rounded-full bg-edge-strong overflow-hidden cursor-pointer',
  scrubFill: 'absolute inset-y-0 left-0 rounded-full bg-accent',
  scrubThumb:
    'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-3.5 h-3.5 rounded-full bg-surface border-2 border-accent shadow-raised pointer-events-none',
  /** Tick under the scrubber marking a frame of interest. */
  scrubMarker: 'absolute bottom-0 w-1.5 h-1.5 rounded-full bg-content-subtle -translate-x-1/2',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   TABS — three kinds, by what they switch between
   ═══════════════════════════════════════════════════════════════════════════ */

export const tab = {
  /** Page-level tabs in the header. Switch the whole workspace. */
  pageBar: 'flex items-end gap-1',
  page: (active: boolean) =>
    `px-5 py-2.5 text-sm font-medium rounded-t-lg border-t border-l border-r ${transition} ${focusRing} ${
      active
        ? '-mb-px bg-surface-sunken border-edge text-content'
        : 'bg-transparent border-transparent text-content-subtle hover:text-content hover:bg-surface-hover'
    }`,

  /** Tabs inside a panel or content pane. Switch what the pane shows. */
  paneBar: 'flex-shrink-0 flex border-b border-edge',
  pane: (active: boolean) =>
    `flex-1 px-2 py-2.5 text-xs font-medium border-b-2 -mb-px ${transition} ${focusRing} ${
      active
        ? 'border-accent text-accent'
        : 'border-transparent text-content-subtle hover:text-content'
    }`,

  /** A tab per data group (one per goal distance). Scrolls horizontally. */
  groupBar: 'flex-shrink-0 flex border-b border-edge overflow-x-auto',
  group: (active: boolean) =>
    `flex items-center gap-1 border-r border-edge ${
      active ? 'bg-surface' : 'bg-surface-panel hover:bg-surface-hover'
    }`,
  groupLabel: (active: boolean) =>
    `px-2.5 py-2 text-sm font-mono tabular-nums whitespace-nowrap ${transition} ${focusRing} ${
      active ? 'text-content' : 'text-content-subtle hover:text-content'
    }`,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   LISTS — selectable rows of things
   ═══════════════════════════════════════════════════════════════════════════ */

export const list = {
  /** A row in a list of things you pick between (videos, trajectories). */
  item: (selected: boolean) =>
    `px-3 py-2.5 rounded-lg text-sm cursor-pointer ${transition} ${
      selected
        ? 'bg-accent text-accent-on'
        : 'text-content-muted hover:bg-surface-hover hover:text-content'
    }`,
  /** Secondary text inside a list row — must invert with the row. */
  itemMeta: (selected: boolean) =>
    `text-xs truncate ${selected ? 'text-accent-on/75' : 'text-content-subtle'}`,

  /** A row that expands into controls rather than being selected outright. */
  card: (active: boolean) =>
    `px-3 py-2.5 rounded-lg text-sm ${transition} ${
      active ? 'bg-surface-hover ring-1 ring-edge-strong' : 'hover:bg-surface-hover'
    }`,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   TABLES — dense numeric grids
   ═══════════════════════════════════════════════════════════════════════════ */

/** Row states, in priority order: invalid beats optimal beats hovered. */
export type TableRowState = 'default' | 'hovered' | 'optimal' | 'invalid';

export const table = {
  header:
    'flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-surface-hover border-b border-edge text-xs font-semibold text-content-subtle select-none',
  /** A sortable column heading. */
  headerCell: `flex-1 text-left ${transition} hover:text-content ${focusRing}`,

  /**
   * Every row carries a transparent 2px left edge so that highlighting a row
   * recolours that edge instead of adding one — otherwise rows would jog
   * sideways as the hover moves down the table.
   */
  row: (state: TableRowState = 'default') => {
    const base =
      'relative flex items-center gap-1 px-3 py-2 border-b border-edge-subtle border-l-2 text-sm group';
    switch (state) {
      case 'invalid':
        return `${base} border-l-critical bg-critical-soft`;
      case 'optimal':
        return `${base} border-l-positive bg-positive-soft`;
      case 'hovered':
        return `${base} border-l-accent bg-accent-soft`;
      default:
        return `${base} border-l-transparent hover:bg-surface-hover`;
    }
  },

  /** A numeric cell. Primary reading. */
  cell: (state: TableRowState = 'default') =>
    `flex-1 font-mono tabular-nums ${state === 'invalid' ? 'text-critical' : 'text-content'}`,
  /** A numeric cell of secondary interest (time of flight, impact angle). */
  cellMuted: (state: TableRowState = 'default') =>
    `flex-1 font-mono tabular-nums ${state === 'invalid' ? 'text-critical/80' : 'text-content-muted'}`,
  /** The ± margin-of-error suffix printed after a value. */
  cellAnnotation: (state: TableRowState = 'default') =>
    `text-xs ${state === 'optimal' ? 'text-positive' : 'text-content-subtle'}`,
  /**
   * Signed error: over-shoot and under-shoot read differently. An invalid row
   * overrides the sign entirely — on a failed refine the number is meaningless,
   * so it must not look like a good or bad result.
   */
  cellSigned: (sign: 'over' | 'under' | 'exact' | 'none', state: TableRowState = 'default') => {
    const base = 'flex-1 font-mono tabular-nums';
    if (state === 'invalid') return `${base} text-critical`;
    if (sign === 'none') return `${base} text-content-faint`;
    if (sign === 'over') return `${base} text-caution`;
    if (sign === 'under') return `${base} text-data-secondary`;
    return `${base} text-positive`;
  },
  /** Right-hand action cluster, revealed on row hover. */
  actions: 'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity',

  /**
   * A real HTML <table>. The entries above are for the flex-based grids that
   * make up most of this app; these are for the handful of places that use
   * semantic table markup, where flex-1 would break the layout.
   */
  nativeWrap: 'overflow-auto rounded-md border border-edge',
  nativeHead: 'sticky top-0 bg-surface-hover text-content-subtle text-xs font-semibold',
  nativeHeadCell: 'px-2 py-1.5 text-left font-semibold',
  nativeRow: 'border-b border-edge-subtle last:border-b-0 hover:bg-surface-hover',
  nativeCell: 'px-2 py-1 font-mono tabular-nums text-content',
  nativeCellMuted: 'px-2 py-1 text-content-subtle',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES — a state or a count, inline with text
   ═══════════════════════════════════════════════════════════════════════════ */

const badgeBase = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold';

export const badge = {
  neutral: `${badgeBase} bg-surface-hover text-content-muted`,
  positive: `${badgeBase} bg-positive-soft text-positive`,
  caution: `${badgeBase} bg-caution-soft text-caution`,
  critical: `${badgeBase} bg-critical-soft text-critical`,
  /** A count attached to a tab, showing whether that tab is the current one. */
  count: (active: boolean) =>
    `px-1.5 py-0.5 rounded text-xs font-medium ${
      active ? 'bg-accent-soft text-accent' : 'bg-surface-hover text-content-subtle'
    }`,
  /** A count that isn't tied to selection — a running total beside a heading. */
  total: 'px-1.5 py-0.5 rounded text-xs font-medium bg-surface-hover text-content-muted',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   OVERLAYS — dialogs, floating panels, menus, tooltips
   ═══════════════════════════════════════════════════════════════════════════ */

export const overlay = {
  /** Full-screen container that centres a modal. */
  container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
  /** The click-to-dismiss backdrop. Ink, not the text scale — `content`
   *  inverts between themes and a scrim must stay dark in both. */
  scrim: 'absolute inset-0 bg-scrim/50',
  /** A modal dialog card. */
  dialog: 'relative w-full rounded-lg border border-edge bg-surface p-5 shadow-overlay',
  dialogTitle: 'text-base font-semibold text-content mb-1',
  /** A dialog choice presented as a pair of large buttons. */
  choice: (selected: boolean) =>
    `px-3 py-2.5 text-sm font-medium rounded-md border ${transition} ${focusRing} ${
      selected
        ? 'border-accent bg-accent-soft text-accent'
        : 'border-edge-strong bg-surface text-content-muted hover:bg-surface-hover'
    }`,

  /** A panel that floats over the workspace and can be dragged. */
  floatingPanel:
    'absolute pointer-events-auto rounded-lg border border-edge bg-surface/95 p-3 shadow-overlay backdrop-blur-sm',
  floatingHandle: 'select-none touch-none',

  /** Right-click menu. */
  menu: 'fixed z-50 min-w-[10rem] rounded-md border border-edge bg-surface py-1 text-sm text-content shadow-overlay',
  menuItem: `block w-full text-left px-3 py-1.5 ${transition} hover:bg-surface-hover ${focusRing}`,
  menuItemDanger: `block w-full text-left px-3 py-1.5 text-critical ${transition} hover:bg-critical-soft ${focusRing}`,

  /**
   * A floating card positioned at the cursor. Unlike `dialog` (centred,
   * relative) and `floatingPanel` (absolute), this one is `fixed`, so it can be
   * placed from a pointer event without fighting a positioning utility.
   */
  popover: 'fixed z-50 rounded-lg border border-edge bg-surface p-3 shadow-overlay',

  /** Hover readout over a chart or canvas. */
  tooltip:
    'pointer-events-none rounded-md border border-edge bg-surface px-3 py-2 text-xs text-content shadow-overlay tabular-nums space-y-0.5',
  /** One "label — value" line inside a tooltip. */
  tooltipRow: 'flex items-center justify-between gap-3',
  tooltipLabel: 'text-content-subtle',
  /** The value in a tooltip row. Colour it with the matching series colour. */
  tooltipValue: 'font-mono tabular-nums text-content',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   FEEDBACK — progress and action results
   ═══════════════════════════════════════════════════════════════════════════ */

export const feedback = {
  progressTrack: 'relative h-1.5 rounded-full bg-edge-strong overflow-hidden',
  progressFill: 'absolute top-0 left-0 h-full rounded-full bg-accent transition-all duration-100',
  progressFillPositive: 'absolute top-0 left-0 h-full rounded-full bg-positive transition-all duration-100',
  /** The line of text reporting how an action went. */
  status: (ok: boolean | null) =>
    `text-xs leading-snug ${
      ok === true ? 'text-positive' : ok === false ? 'text-critical' : 'text-content-subtle'
    }`,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   CHROME — structural furniture with no content of its own
   ═══════════════════════════════════════════════════════════════════════════ */

export const chrome = {
  /** Row/tab affordance that only appears while the parent is hovered. The
   *  parent must carry `group` (or a named `group/x` and a matching modifier). */
  revealOnHover: 'opacity-0 group-hover:opacity-100 transition-opacity',

  /** Draggable edge between a panel and the content area. */
  resizeHandle: 'group flex-shrink-0 select-none',
  resizeGrip: 'bg-edge group-hover:bg-accent transition-colors',
  /** The tab-shaped button that collapses a side panel. */
  collapseToggle: `absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-5 h-10 bg-surface text-content-subtle border border-edge hover:bg-surface-hover hover:text-content ${transition} ${focusRing}`,

  /**
   * The video stage. TRUE BLACK on purpose: the video is letterboxed with
   * `object-contain`, so this colour is what shows in the bars beside the
   * footage. Black reads as "outside the frame" rather than as a UI surface.
   */
  videoStage: 'relative flex-1 bg-stage overflow-hidden',
  /** The same area before any video is loaded — a normal light empty state. */
  emptyStage: 'flex-1 flex flex-col items-center justify-center gap-10 bg-surface',
  /** Large circular affordance in an empty state ("upload", "import"). */
  emptyAction: `w-16 h-16 rounded-full bg-surface-hover text-content-subtle hover:bg-surface-active hover:text-content flex items-center justify-center ${transition} ${focusRing}`,

  /** Toolbar strip under the video holding the scrubber and frame controls. */
  videoToolbar: 'relative flex-shrink-0 bg-surface-panel border-t border-edge px-4 py-3',
  /**
   * A control that sits ON the video rather than beside it. Uses the
   * theme-independent video-* tokens, because its backdrop is footage — it must
   * NOT invert when the app switches to dark, or it would go light-on-light
   * over a bright frame.
   */
  onVideoLabel:
    'fixed z-50 px-1.5 py-0.5 rounded text-xs font-bold text-center outline-none shadow-overlay bg-scrim/90 text-video-ink border border-video-accent',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   BRAND — the BrainSTEM wordmark. Fixed identity colours, used in exactly one
   place. Do not reuse them as UI colours.

   Fixed identity colours, used in exactly one place. Tuned for legibility on a
   light surface; do not reuse them as UI colours.
   ═══════════════════════════════════════════════════════════════════════════ */

/*
 * These resolve through the theme variables rather than being literal hexes, so
 * the wordmark lifts to brighter hues in dark mode instead of going muddy. They
 * are CSS colour strings — valid in `style={{ color }}`, but NOT assignable to a
 * canvas context. Canvas code uses plotPalette() instead.
 */
export const brand = {
  blue: 'rgb(var(--c-brand-blue))',
  green: 'rgb(var(--c-brand-green))',
  red: 'rgb(var(--c-brand-red))',
  gold: 'rgb(var(--c-brand-gold))',
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS & CHART COLOURS
   ───────────────────────────────────────────────────────────────────────────
   Canvas and chart code can't use Tailwind classes and can't read a CSS
   variable off a context, so the tokens are mirrored here as plain strings —
   once per theme. These MUST stay in sync with the channels in src/index.css:
   change one, change the other.

   Canvas components pick a palette with plotPalette(useThemeMode()) and must
   list it in their draw dependencies so a theme flip repaints.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Drawn on a LIGHT background: the trajectory-generation plot and the charts. */
export const plotColors = {
  background: '#FFFFFF',
  grid: '#E5E8EB',
  gridStrong: '#DBDEE2',
  axis: '#C1C6CC',
  axisLabel: '#62686F',
  axisTitle: '#62686F',

  /** Left-axis series (exit speed, speed MOE, low-arc buffer). */
  seriesPrimary: '#3A5A6E',
  /** A second left-axis series (high-arc buffer). */
  seriesPrimaryAlt: '#7994A6',
  /** Right-axis series (exit angle, angle MOE). */
  seriesSecondary: '#A05A24',
  /** Min–max spread behind a series. Same hue, low alpha. */
  seriesPrimarySpread: 'rgba(58, 90, 110, 0.18)',
  seriesSecondarySpread: 'rgba(160, 90, 36, 0.18)',

  /** One candidate trajectory among many. */
  candidate: 'rgba(20, 23, 26, 0.22)',
  /** The candidate under the cursor. */
  candidateHovered: '#3A5A6E',
  /** Optimal / best-margin-of-error trajectory. */
  optimal: '#2E7A4E',
  optimalSelected: '#1F5A38',
  optimalPoint: '#2E7A4E',
  /** The lowest-exit-speed trajectory. */
  lowestSpeed: '#14171A',
  /** Goal plane and the target marker. */
  goal: '#91630F',
  goalSelected: '#B8801A',
  /** Draggable reference line the user positions by hand. */
  referenceLine: '#AF3729',
  /** Point markers drawn on top of a series. */
  pointStroke: '#FFFFFF',
  /** Outline for a draggable handle, where a white ring would vanish on white. */
  markerOutline: '#14171A',
  /** Zero line on a derivative plot. */
  zeroLine: '#7F848B',
} as const;

/** Every plot role, as CSS colour strings. Both palettes satisfy this. */
export type PlotPalette = { [Role in keyof typeof plotColors]: string };

/**
 * The same roles on a DARK background. Entry-for-entry identical to
 * `plotColors` — PlotPalette enforces that, so adding a role to one palette
 * forces you to add it to the other.
 */
export const plotColorsDark: PlotPalette = {
  background: '#1B1F23',
  grid: '#2A3037',
  gridStrong: '#3A4047',
  axis: '#505861',
  axisLabel: '#9AA1A9',
  axisTitle: '#9AA1A9',

  seriesPrimary: '#7EA8C4',
  seriesPrimaryAlt: '#A8C2D4',
  seriesSecondary: '#D89A62',
  seriesPrimarySpread: 'rgba(126, 168, 196, 0.22)',
  seriesSecondarySpread: 'rgba(216, 154, 98, 0.22)',

  candidate: 'rgba(237, 239, 242, 0.23)',
  candidateHovered: '#A8C2D4',
  optimal: '#5FBE85',
  optimalSelected: '#8FD9AD',
  optimalPoint: '#5FBE85',
  lowestSpeed: '#EDEFF2',
  goal: '#D2A24A',
  goalSelected: '#EFC272',
  referenceLine: '#E3705F',
  /** Rings sit on a dark ground, so they invert with everything else. */
  pointStroke: '#14171A',
  markerOutline: '#EDEFF2',
  zeroLine: '#7C838B',
};

/** The plot palette for a theme. Canvas code's single entry point. */
export function plotPalette(mode: 'light' | 'dark'): PlotPalette {
  return mode === 'dark' ? plotColorsDark : plotColors;
}

/**
 * Drawn on VIDEO FOOTAGE, which is dark and busy. These stay bright and
 * saturated on purpose — they are not the same problem as the light-surface
 * palette above, and they must survive being drawn over arbitrary pixels.
 */
export const videoOverlayColors = {
  /** Plotted trajectory points for the segment being edited. */
  activePoint: '#FFFFFF',
  activePointStroke: '#000000',
  /** Gravity-corrected helper points. */
  gravityPoint: 'rgba(156, 163, 175, 0.85)',
  gravityLine: 'rgba(156, 163, 175, 0.6)',
  gravityPointStroke: 'rgba(75, 85, 99, 0.9)',
  /** The fitted simulation overlay. */
  simulation: 'rgba(34, 197, 94, 0.95)',
  /** Meterstick, by interaction state. */
  meterstick: '#FBBF24',
  meterstickHovered: '#FDE68A',
  meterstickSelected: '#FEF08A',
  meterstickLabel: '#FDE68A',
  /** Halo behind on-video text so it stays readable. */
  textShadow: 'rgba(0, 0, 0, 0.85)',
} as const;

/**
 * Per-trajectory series colours, assigned by index. Drawn over video, so the
 * same reasoning as videoOverlayColors applies.
 */
export const trajectorySeriesColors = [
  '#ef4444', // red
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
] as const;
