# Research: Layout, Identity, and Pattern References

Reference images analyzed from `docs/design-refs/`. Focus: identifying distinct design languages, naming candidates, layout patterns, and extracting cross-cutting improvements for Obsidian. Organized by cluster.

---

## Layout References

### layout1.jpeg — Consumer SaaS Dashboard

- **Layout:** Left sidebar nav, top stat row with 4 KPI chips, center chart area, right promo card (dark blue with CTA), bottom two-column section (activity feed + invoice table).
- **Visual character:** Friendly, consumer-grade SaaS. Rounded corners everywhere, gradient accent card, light and airy.
- **Color:** White background, vivid Royal Blue (#2563EB range) as primary brand, accent green/orange/pink dots for category indicators, dark navy promo card.
- **Typography:** Rounded sans-serif, medium weight labels, dollar figures at larger weight but not monospace.
- **Distinctive patterns:** Colorful category dots on stat chips; blue sidebar active state with white text pill; gradient hero card as right-column promotional element.
- **Design language candidate:** NO — generic SaaS-blue dashboard, no strong identity.
- **Obsidian notes:** The stat chip pattern (label above, value bold below, delta badge inline) is a clean dense pattern worth formalizing. Gradient anchor card confirms Obsidian's flat dark approach is structurally stronger than gradient.

---

### layout2.jpg — Invoice Detail Full-Width View

- **Layout:** Full-width invoice detail. Left two-thirds: line-item document area. Right column: notes panel + audit log timeline. Top bar: breadcrumb, action buttons, prominent orange CTA.
- **Visual character:** Clean, document-first, professional. The invoice reads like a printed artifact on screen.
- **Color:** White surface, light grey page, orange accent (#F97316 range) only on the primary action button and "Unpaid" status badge. All other UI is neutral.
- **Typography:** Bold large INV number. Regular weight body. No monospace on dollar amounts — a gap against Obsidian's semantic monospace rule.
- **Distinctive patterns:**
  - Right panel audit log as vertical timeline with icon-coded events
  - "Document on grey page" feel
  - Orange CTA for payment action against an otherwise neutral palette — precise functional color
- **Design language candidate:** NO — functional and clean but not a distinct named identity.
- **Obsidian notes:** Audit log timeline (icon + actor + action + timestamp, stacked vertically) is excellent for Obsidian financial contexts. Dollar amounts should use `--obs-font-data` — this reference confirms what NOT to do. Orange CTA against neutral palette is a disciplined and correct functional color application.

---

### layout3.jpg — Minimal Calendar (Swiss Editorial)

- **Layout:** Narrow icon-only left rail, wide right content area showing a weekly calendar grid. Large date heading top-left, "Add event" black button top-right.
- **Visual character:** Swiss editorial minimalism. White space is a deliberate structural element. Grid lines separate days; calendar cells are open space, not boxed.
- **Color:** White canvas, pure black type, single accent red/orange (#E44D26 range) only on the current day (FRI "03") and one floating chip icon. Everything else achromatic.
- **Typography:** Large bold condensed date heading, small all-caps weekday labels, numeric dates at large scale as structural elements. Clean sans-serif throughout.
- **Distinctive patterns:**
  - Horizontal rule beneath each day header (not bounding boxes)
  - Strikethrough text for cancelled events
  - Single accent color as "today" marker only — one pointer, nothing else
  - Floating action button bottom-right (orange dot)
- **Design language candidate:** YES → **Vellum**
  - Named after the translucent document material: white, flat, precise, where typography carries everything and space is structural.
- **Obsidian notes:** The "today accent = only colored element in the view" principle applies to Obsidian's calendar/timeline contexts. Horizontal rule as day separator (rather than bordered cells) reduces visual noise significantly in dense list views.

---

### layout4.jpg — Medical Timeline / Patient Workflow

- **Layout:** Pill-shaped chrome container with top tab bar, patient summary strip, horizontal scrolling timeline as main content, bottom scrubber/zoom bar. Cards float on the timeline at temporal positions.
- **Visual character:** Medical/scientific workflow. Organic and curved but data-precise. Softened corners everywhere including the outer chrome.
- **Color:** Warm grey (#E8E5DF) background, deep dark olive/army green (#2D3B2D) header and chrome, neon chartreuse yellow (#EFFF4A) as singular accent — used for active state dots, tags, and interactive elements.
- **Typography:** Light weight sans-serif, tight tracking. Small data labels. Yellow accent draws eye to interactive affordances.
- **Distinctive patterns:**
  - Timeline as horizontal scroll with cards anchored at dates
  - Pill-tab navigation bar
  - Outer "device frame" chrome treating the app as an embedded instrument
  - Bicolor pill badges
- **Design language candidate:** YES → **Instrument**
  - Named after scientific/medical monitoring devices: warm neutral casing, precise readouts, single alert-color accent on dark olive.
- **Obsidian notes:** Outer rounded container framing (treating the whole app as a discrete device) is a strong compositional idea for modal or focused views. Chartreuse-on-dark-olive is too loud for Obsidian but the concept — one accent only on interactive/live elements — aligns with Obsidian's functional color restraint.

---

### layout5DESIREDESIGNLAYOUT.jpg — Logistics Command Interface

- **Layout:** Top horizontal navigation with many tabs, full-width hero truck illustration with overlaid load-planning grid, side panel (right) for data entry, bottom two-zone split: left list + right Gantt chart.
- **Visual character:** Operational/logistics command interface. Dense, tool-heavy, information-rich.
- **Color:** Off-white (#F8F8F6) main surface, black text, small green/red delta badges, vivid violet/purple (#7C3AED) on Gantt chart active bars.
- **Distinctive patterns:**
  - Product illustration as interactive map (truck body becomes a grid of cargo slots)
  - Gantt chart with color-coded time blocks
  - "Current now" red vertical line on timeline
  - Dual-pane bottom workspace
- **Design language candidate:** NO — too domain-specific to logistics.
- **Obsidian notes:** The Gantt/timeline dual-pane is a strong pattern. "Product as interactive canvas" (treating an asset diagram as a selectable map) applies to asset management views in Obsidian.

---

## Sidebar References

### sidebar1.jpg — Dual-Rail Sidebar (SaaS)

- **Layout:** Narrow icon-only rail left, expanded text+icon rail right. Bottom: "Current plan" upgrade card with bordered CTA. User profile anchor very bottom.
- **Visual character:** Light, polished, modern SaaS — closest to Linear/Notion style.
- **Color:** Blue-grey (#E8EBF0) page background, white panels, indigo/blue (#4F46E5) for brand/active states. Upgrade card uses soft lavender fill.
- **Distinctive patterns:**
  - Icon-only + expanded rail dual-sidebar
  - Upgrade upsell card embedded at sidebar bottom
  - Plan tier indicator as persistent ambient UI
- **Design language candidate:** NO — polished but generic modern SaaS.
- **Obsidian notes:** The persistent plan/tier indicator at sidebar bottom is worth adopting in Obsidian — surfaces financial/operational state without interrupting workflow. Dual-rail proportions here are well-balanced.

---

### sidebar2.jpg — Pitch-Black Monochrome Sidebar

- **Layout:** Single-panel sidebar on near-black canvas. Search bar at top with keyboard shortcut hint. Icon+label nav items. Active item has a filled dark-grey rounded pill background.
- **Visual character:** Extremely dark, quiet, confident. Almost no visual noise. The whole sidebar is one tone family — black, near-black, dark grey.
- **Color:** True black (#0A0A0A) page, charcoal (#1C1C1C) panel, dark grey (#2A2A2A) active pill. Pure white text. No color at all.
- **Typography:** System-weight sans-serif, white on dark. Muted grey for disabled items.
- **Distinctive patterns:**
  - Keyboard shortcut badge inside search bar ("/")
  - Active state via filled pill, not color change
  - Three-tier text opacity hierarchy: white (active), grey (inactive), lighter grey (disabled)
- **Design language candidate:** YES → **Graphite**
  - Dense, matte black, no reflectance. Structure through tonal shift only. A harder, darker cousin to Obsidian.
- **Obsidian notes:** The "/" keyboard shortcut indicator inside the search input is an elegant pattern Obsidian should adopt. Three-tier opacity hierarchy (active/inactive/disabled) with no color confirms it works at scale. Directly validates Obsidian's "hierarchy without color" principle.

---

## Archive / Folder References

### archives1.jpg — Physical Card-File Drawer (Illustration)

- **Layout:** Stylized isometric illustration of a physical card-file drawer. Alphabetical divider tabs in black with white text (O, P, Q, R, S). Numbered entries on white file cards. Yellow label at bottom naming the drawer.
- **Visual character:** Physical archive metaphor rendered digitally. Flat illustration, clean lines, high contrast.
- **Color:** Light grey background, white cards with black text, solid black tabs with white labels, single yellow accent pill label at bottom.
- **Typography:** Monospace or fixed-width on numbers and names — perfectly numeric-grid aligned. Divider tabs use bold compressed type.
- **Distinctive patterns:**
  - Staggered depth/layering to imply physical stack
  - Black divider tabs as strong categorical anchors
  - Yellow label as single accent — purely functional labeling
- **Design language candidate:** YES → **Ledger**
  - After physical accounting ledger books and card indexes: structured, enumerated, archival. A system that looks like it stores the truth.
- **Obsidian notes:** Black divider-tab-as-section-header concept maps to Obsidian's dark card principle. Full-bleed black bars with white type would be a strong pattern for grouped list views. Staggered layering as visual metaphor for depth/nesting is worth exploring for archive views.

---

### folder1.jpg — Neumorphic Folder Widget

- **Layout:** Single centered component — a folder icon/card in neumorphic style showing "4 Files" label and a storage capacity bar (500/700MB with signal bar indicators).
- **Visual character:** Neumorphic/soft-UI — extruded surfaces using matching shadow pairs on light grey background. Very soft and rounded.
- **Color:** All light grey (#E8E8E8 background, #F0F0F0 surface), subtle shadow-defined depth, single green accent on capacity bars — functional signal only.
- **Distinctive patterns:**
  - Neumorphic shadow pair for depth without borders
  - Signal bar pattern for capacity (5-bar like cellular signal)
  - Folder tab as structural shape, not decoration
- **Design language candidate:** YES → **Alabaster**
  - After the pale, smooth, translucent stone that appears to glow from within. Soft, borderless, light-defined form.
- **Obsidian notes:** Obsidian uses shadow for card elevation (floating above page), not neumorphic extrusion (forms pushed out of the page surface). Both are valid but incompatible. The capacity signal bar as a data primitive is worth absorbing for storage/usage display.

---

## Creative Tool / Boardroom References

### boardroom1.jpg — Dark Canvas Node-Graph Workflow Editor

- **Layout:** Full-canvas dark node-graph. Floating cards connected by bezier wire paths. Right: preview image pane. Bottom: floating text panel for output. Coordinate readouts in all four corners.
- **Visual character:** Professional creative tool / ML workflow. Star-field background (dark with subtle noise). Glassmorphic card surfaces. Ambient glow effects on preview image.
- **Color:** Near-black (#121212) canvas with faint noise texture. Colored status dots (green/orange/red) as signal indicators. Neon user avatar labels (yellow, pink). Only non-neutral elements.
- **Distinctive patterns:**
  - Wire connections as visual data flow
  - Status dot as live/connected signal
  - Coordinate readout in corners as persistent spatial orientation
  - User presence labels (colored pills with name + avatar) for collaboration
- **Design language candidate:** YES → **Schematic**
  - After electrical/systems schematics: dark substrate, wire connections, node logic, machine intelligence visible on the surface.
- **Obsidian notes:** Status dot (green = active, orange = processing, red = error) is a precise functional color pattern Obsidian should formalize for live state indicators. Currently underspecified.

---

### boardroom2.jpg — Developer Ops Topology Map

- **Layout:** Left sidebar with hierarchical project/resource tree. Right panel: infrastructure topology map (dot-grid canvas) with floating node cards connected by vertical lines.
- **Visual character:** Developer/ops tool — Vercel/Railway aesthetic. White light background, precision layout, soft card corners, subtle dot-grid canvas texture.
- **Color:** White sidebar and card surfaces, light grey page, dot-grid subtle grey, status green dot on live items, orange warning badge, muted blue accents for active tabs.
- **Typography:** System sans-serif, tight spacing. Monospace used for git hashes ("e5f6a7b"), version identifiers, and deployment codes — correct semantic monospace usage.
- **Distinctive patterns:**
  - Dot-grid canvas as infinite-plane background
  - Vertical line topology connectors between nodes
  - Status dot paired with label (green = live)
  - Git hash in monospace as identity anchor
  - Warning node card with orange border highlight
- **Design language candidate:** YES → **Blueprint**
  - Precise, technical, structural — the diagram language of systems engineers. Light ground, dark ink lines, node identifiers in monospace.
- **Obsidian notes:** Git hashes/transaction IDs in monospace confirms `--obs-font-data` semantic rule. Dot-grid as infinite-plane canvas texture is worth considering for spatial exploration views (node maps, timelines). Warning card with colored border (orange highlight on "Unstable" node) adds one tier of status expression above badges without full surface color — Obsidian should consider this for critical invoice overdue state.

---

## Industrial / Technical References

### industial1.jpeg — Industrial Technical Poster

- **Layout:** Full-bleed dark poster. Hero technical illustration (exploded lens/optic diagram) left-center. Headline top-left. Feature callout lines right with labels. Single color bar bottom-right. Brand logo top-left.
- **Visual character:** Industrial technical documentation / blueprint poster. Dark, confident, architectural. Engineering diagram conventions (leader lines, exploded views) used as aesthetic elements.
- **Color:** Dark charcoal (#1A1A1A) background, pure white illustration lines and text, single rainbow spectral bar as the only color — used as a brand accent strip, not hierarchy.
- **Typography:** Bold large sans-serif headline. Small caption sans for feature labels. Very high contrast.
- **Distinctive patterns:**
  - Engineering leader lines as information architecture (line from object to label list)
  - Exploded technical diagram as hero illustration
  - Dark canvas with white-line art
  - Spectral/rainbow as single contained accent strip
- **Design language candidate:** YES → **Halide**
  - After the photosensitive chemical layer in film. Technical precision aesthetics, dark substrate, white-line diagram language, hidden machinery made visible.
- **Obsidian notes:** Leader lines from a data element to its label list is worth considering for Obsidian's expanded/detail views (e.g., an asset record with callout annotations). "Exploded view" as an illustration convention for empty states or about pages would be distinctive.

---

### industrial2.jpeg — Cinematic Infographic Poster

- **Layout:** Two-zone vertical split. Upper half: dark near-black field with white wireframe 3D robot/mech illustration. Lower half switches to pure white with dense editorial information layout — curved timeline, labeled diagram nodes, small body copy blocks.
- **Visual character:** Cinematic infographic poster. Dramatic contrast reversal between zones. Print-editorial typography conventions.
- **Color:** Black (#0A0A0A) upper zone with white wireframe. White (#FFFFFF) lower zone with black text. No other colors.
- **Typography:** All caps labels, small body text, circular icon nodes on the timeline. Purely typographic hierarchy — no color signals at all.
- **Distinctive patterns:**
  - Hard zone split (dark/light) as vertical composition device
  - Circular node markers on a curved timeline path
  - Wireframe 3D illustration — edges only, no fill
  - Dramatic contrast inversion as narrative structure
- **Design language candidate:** YES → **Manifesto**
  - Declarative, high-contrast, typographically authoritative. The feeling of an architectural or film statement printed on heavy stock.
- **Obsidian notes:** The hard dark/light zone split used compositionally (not just for cards) validates Obsidian's dark/light duality taken to its logical maximum for full-page layouts like landing, onboarding, or pricing views.

---

## Assets / Operational References

### assets1.jpg — Radical Terminal Interface

- **Layout:** Two-row, three-column grid of dark terminal-style cells. Each cell has a label, a data value, and a unit or secondary value. Circular progress indicator in top-left cell. Grid lines as thin white lines.
- **Visual character:** Radical terminal/mainframe UI. No softness. Could be a Unix machine data transfer readout redesigned with extreme graphic restraint.
- **Color:** Pure black (#000000) background and cells, pure white (#FFFFFF) text and grid lines. No other colors.
- **Typography:** ALL CAPS monospace throughout — labels, values, units, button text. Outlined rectangle buttons with monospace text.
- **Distinctive patterns:**
  - Thin white border grid as layout system
  - Monospace caps for every text element without exception
  - Circular sweep progress indicator in white strokes (no fills)
  - No fills, no color, no radius — everything is outline and line
- **Design language candidate:** YES → **Terminus**
  - The end of the line, the final station, where data arrives stripped of decoration. Pure signal. The terminal paradigm taken to its visual extreme.
- **Obsidian notes:** Shows what happens if all softness is removed — useful reference for operator-mode views, admin panels, or raw data export contexts. The grid-cell layout (thin lines, no padding, no radius) could be an explicit "compact terminal" variant within Obsidian for high-density data tables.

---

### assets2.jpg — Polished Monochrome SaaS Dashboard

- **Layout:** Left sidebar with navigation. Main content: one dark hero card (Overall Information) top-left, two light metric cards top-right, two-column task/checklist area middle, three dark project cards at bottom.
- **Visual character:** Polished monochrome SaaS dashboard. Black and white only. Glassmorphic backdrop visible through outer chrome.
- **Color:** White sidebar and light cards, black dark cards and action button. Perfectly achromatic.
- **Distinctive patterns:**
  - Multiple dark cards at bottom — three competing dark surfaces (violates Obsidian's "one dark card" rule)
  - Glassmorphic outer frame (texture visible only in background)
  - Progress indicator ring on project cards
- **Design language candidate:** NO — very close cousin to Obsidian. Not a separate language, but an important comparison point.
- **Obsidian notes:** CRITICAL REFERENCE. Closest analogue to Obsidian's intended aesthetic. Three competing dark cards at the bottom confirms "one dark card per layout" is the correct constraint — without it, the dark-card language loses its anchor power. Glassmorphic outer frame is worth testing as a modal/overlay treatment in Obsidian.

---

### assets3.jpg — Ultra-Light Clinical Productivity App

- **Layout:** Narrow icon rail, two-panel workspace: left panel is a planner with list view and an analog clock widget, right panel is a todo list.
- **Visual character:** Ultra-light productivity app. Almost clinical. Analog clock is the single decorative element — all else is pure function.
- **Color:** Very light blue-grey (#EEF2F7) background, white panels, near-black (#0F1729) as the single dark element. No accent colors.
- **Typography:** Light-weight sans-serif, very small text, generous internal padding. "4pm" at medium-large weight is the only size escalation.
- **Distinctive patterns:**
  - Analog clock face as a card widget (functional, not decorative)
  - Three-tier filter list (Unplanned / Planned / All) as plain text links
  - Near-invisible separators
- **Design language candidate:** YES → **Glacier**
  - Cold, still, precisely structured, no warmth. Everything recedes into a single pale blue-grey field except the single dark anchor.
- **Obsidian notes:** Obsidian's neutral is warm grey (#EBEBEB). Cool grey variant would read more clinical — appropriate for medical/compliance/legal contexts. Analog clock widget as a legitimate data-display primitive is interesting (timestamps are machine data, but a clock face is the human interface to that data).

---

### assets4.jpg — Infrastructure Energy Map

- **Layout:** Left narrow sidebar with icon nav. Right content area split: left side white panel with data table (Energy Overview); right side large dark map canvas with building footprint outlines and labeled zones.
- **Visual character:** Infrastructure monitoring / energy operations. Map canvas is the hero — satellite-style overhead view in pure black with white outlines and dot-matrix texture filling selected zones.
- **Color:** Black (#000000) canvas, white outlines and node labels, white/light panel for data sidebar, single blue dot (1 element). Near-monochromatic with the white panel as the functional island in darkness.
- **Typography:** Bold "Energy Overview" heading, small dense data labels, monospace-adjacent for values (68%, 99.4%, kWh figures).
- **Distinctive patterns:**
  - White-outline building footprint map on black — like an architectural site plan
  - Dot-matrix texture fill on selected/active zones
  - Light sidebar as an island of clarity in a dark operational canvas
  - Corner-bracket markers in the top nav as a targeting/framing affordance
- **Design language candidate:** YES → **Cartograph**
  - After technical mapping and land survey: dark terrain, white-line structures, precise coordinate-based data, the view from above.
- **Obsidian notes:** "Light panel as island in dark operational canvas" is a strong pattern for Obsidian's split views — document/record panel floating over a dark data map or timeline. Corner-bracket markers as navigation/zoom UI are a sharp, precise affordance pattern.

---

### assets5.jpg — Dark Crypto Wallet Dashboard

- **Layout:** Two-column card grid on dark background. Portfolio balance card (colored asset bars), total balance + bar chart, summary stats + activity dot grid, exchange form, transfers list.
- **Visual character:** Dark crypto/fintech wallet. High density, neon-lit data. Colored bars and sparklines are the primary visual elements.
- **Color:** Near-black background, dark grey cards, multiple neon accents: rainbow asset allocation bars (purple/red/yellow/green), blue/red sparklines, green text for positive deltas. High color use in dark context.
- **Distinctive patterns:**
  - Colored horizontal bars for asset allocation
  - Dot-grid activity calendar
  - Exchange form as two paired inputs with swap icon between
  - Address truncation with ellipsis in transfer records
- **Design language candidate:** NO — standard crypto dark theme. Color use violates Obsidian's restraint principles significantly. Useful as a negative reference.
- **Obsidian notes:** Asset allocation bar (multi-color segmented) can be absorbed in greyscale — only one segment highlighted functionally. Dot-grid activity calendar is an excellent dense data pattern for displaying activity frequency over time.

---

### assets6.jpg — Selection Dialog / Tile Grid

- **Layout:** Single centered modal on light-grey background. 3×2 grid of selection tiles (icon + label each). Two tiles selected (purple border + purple checkmark). Cancel + Continue action buttons.
- **Visual character:** Clean, neutral, airy selection dialog. Purple selection state is the only color.
- **Color:** Light grey background, white modal surface, purple (#5B4FE8) for selected state only (border + checkmark badge). No other colors.
- **Distinctive patterns:**
  - Tile selection with colored border-only highlight (not fill)
  - Circular checkmark badge top-right of selected tile
  - Icon+label tile as grid selection primitive
- **Design language candidate:** NO — generic pattern library modal.
- **Obsidian notes:** "Border-only highlight on selection" (no fill, just colored border + corner badge) is cleaner than fill-selection for Obsidian's dark surface. Tile-grid as a selection primitive is applicable to Obsidian's onboarding/settings flows.

---

## Pattern / Identity References

### patterns1.jpg — Cryptographic Identity Cards

- **Layout:** Three stacked/fanned physical cards photographed as objects. Each card: modular geometric sigil left, hyphenated text identifier right, dot-matrix pattern filling the right portion.
- **Visual character:** Identity/access card system. Physical artifact aesthetic, matte black surface. Sigils feel generative. Dot-matrix pattern evolves in complexity — unique fingerprints.
- **Color:** Pure black (#000000) cards, pure white (#FFFFFF) all graphics and text. Zero color. Pattern variation IS the identity signal.
- **Typography:** Monospace or fixed-pitch text for identifiers (~ropnep-hoshep, ~matlep-tilbyr) — Urbit-style planet names.
- **Distinctive patterns:**
  - Generative modular sigil as avatar/identity marker
  - Dot-matrix as unique pattern fingerprint
  - Monospace hyphenated identifier as primary name
  - Physical card format as identity credential
- **Design language candidate:** YES → **Cipher**
  - Encrypted identity made visual. Black cards, white signals, unique generative marks, the language of credentials and keys.
- **Obsidian notes:** Generative sigil concept (modular geometric mark unique per entity) is worth considering for Obsidian's avatar/entity representation. Dot-matrix fingerprint as a unique visual pattern applies to transaction/entity ID display.

---

## Profile / Settings References

### theme1.jpg — Progressive Disclosure Sidebar (macOS)

- **Layout:** Three-panel: narrow dark vertical icon rail (far left), white popup panel (center-left) with user profile, project tree, status sections, document tree; blurred content panel visible behind popup on right.
- **Visual character:** macOS-native feel, refined. Navigation as progressive disclosure.
- **Color:** Dark grey (#333333) icon rail, white popup, light grey sub-panels, black text. No accents except macOS traffic light dots (window controls, not branding).
- **Distinctive patterns:**
  - Progressive disclosure sidebar (icon triggers popup, not a persistent sidebar)
  - Folder tree with indented hierarchy and item counts
  - Status section with category grouping (New / Updates / Team Review)
  - "Recently Edited" and "Archive" as history-oriented nav items
- **Design language candidate:** NO — refined but standard macOS-pattern navigation.
- **Obsidian notes:** Progressive disclosure navigation (icon rail triggers floating panel) would reduce chrome in Obsidian's app and is worth prototyping. Document tree with per-item counts is a clean density pattern. "History" section (Recently Edited, Archive) as first-class nav group is good IA for Obsidian's financial context.

---

### profile1.jpg — Dark Dropdown Menu

- **Layout:** Small dropdown menu anchored to an avatar button top-right. Menu items: Profile, Settings, Theme (with submenu arrow), Upgrade, divider, Keyboard shortcuts, Help center, Log out.
- **Visual character:** Dark dropdown menu, executed with high precision. Very little space between items.
- **Color:** Dark (#1E1E1E) menu surface, white text, subtle icon stroke at ~70% opacity, hairline separators.
- **Distinctive patterns:** Icon + label menu item with chevron for submenu. Hairline separator rule. Universal dark dropdown pattern.
- **Design language candidate:** NO — universal pattern, no distinct identity.
- **Obsidian notes:** Precise item spacing and icon opacity treatment are aligned with Obsidian. "Theme >" submenu item confirms Obsidian should surface theme-switching in a dropdown with submenu rather than a settings page.

---

### profile2.jpg — Retro Game UI (DOS)

- **Layout:** Two-panel: left grey panel with pixel-art character portrait in a dashed box, dialogue text, and an interaction option; right dark sidebar with date info, inventory list, and analog clock at bottom-right. Bottom of left panel has a data table.
- **Visual character:** Retro game UI — Dope Wars style. All text monospace, all data in ALL CAPS. Purely functional grid. Pixel art character.
- **Color:** Light grey (#CCCCCC) main panel, pure black (#000000) right sidebar, white text on dark, black text on light. Single highlight: black-filled selection label on grey panel.
- **Typography:** All monospace, ALL CAPS. Data labels bold, values aligned in fixed columns.
- **Distinctive patterns:**
  - Pixel art in a dashed-border container (suggesting an image placeholder)
  - Dashed-border as frame convention
  - All monospace all-caps as total typographic commitment
  - Dark/light panel split with pure black right sidebar
  - Right sidebar as temporal/status context (date, next event, clock)
- **Design language candidate:** YES → **DOS**
  - Monochrome, monospace, command-driven, no softness. The pure logical skeleton of an interface before visual design existed.
- **Obsidian notes:** Dashed-border container as an "empty/placeholder" affordance is directly usable in Obsidian. Right sidebar as persistent temporal/status context (today's date, next due date, a clock) is excellent IA — Obsidian should consider a "current context" panel for time-sensitive financial data.

---

## Onboarding / Auth References

### onboarding1.jpg — B2B SaaS Split Onboarding

- **Layout:** Two-panel split modal/page. Dark left panel (~30%): brand name, welcome copy, testimonial quote+avatar at bottom. White right panel (~70%): step indicator, question, selection list (radio-style rows), Back/Continue buttons.
- **Visual character:** Professional B2B SaaS onboarding. Competent and functional.
- **Color:** Dark near-black (#0A1628) left panel, white right panel, teal/green CTA button. Step indicator dots in blue-purple.
- **Distinctive patterns:**
  - Split-panel onboarding (brand left, task right)
  - Progress dots for step tracking
  - Testimonial social proof in left panel as trust signal
  - Radio-style full-row selection with border highlight on selected
- **Design language candidate:** NO — competent but generic B2B onboarding template.
- **Obsidian notes:** Split-panel onboarding pattern (dark brand left, white task right) is a direct pattern for Obsidian's own onboarding/auth flow. Testimonial embedded in the left panel is worth using — a real user's quote as ambient trust during a potentially anxiety-producing setup step.

---

### modal1.jpeg — 3D Product Announcement Modal

- **Layout:** Centered floating modal on blurred dashboard background. Large 3D illustrated hero object (iridescent glass/crystal sphere with wireframe rings), product name, description text, gradient CTA button. Secondary text link below.
- **Visual character:** Glassmorphic 3D product announcement. Maximalist compared to everything else in this set.
- **Color:** White modal surface, black text, gradient CTA (purple-to-gold spectrum). 3D illustration uses full spectrum — prismatic rainbow on glass — contained to the illustration zone.
- **Distinctive patterns:**
  - 3D product illustration contained to upper zone of modal
  - Gradient CTA only on single primary action
  - Blurred background suggesting contextual placement
- **Design language candidate:** NO — marketing modal, not a UI language.
- **Obsidian notes:** "3D illustration contained to the upper zone of a card/modal" aligns with Obsidian's illustration containment rules. Gradient CTA is too decorative for Obsidian but confirms that one single styled primary action can be justified in marketing/announcement contexts.

---

### authenticator1.jpg — 2FA Security Modal (Dark)

- **Layout:** Single centered modal on dark grey background. QR code section + manual code entry left. 6-digit code input (individual digit boxes) below. Cancel (ghost) and Verify (orange filled) button pair at bottom.
- **Visual character:** Functional security modal — no decoration, maximum clarity.
- **Color:** Dark (#1A1A1A) background, near-black (#141414) modal surface, medium grey (#2A2A2A) input cells and secondary button. Orange (#F97316) for active input border and primary CTA only.
- **Distinctive patterns:**
  - 6-digit individual-cell OTP input (each digit in its own box, active cell with colored border)
  - QR code with corner-bracket framing
  - "Can't scan?" as a functional fallback affordance
  - Monospace secret key string
  - Ghost/filled button pair for destructive/constructive actions
- **Design language candidate:** NO — universal security pattern.
- **Obsidian notes:** 6-digit individual-cell OTP input is the correct pattern for Obsidian's MFA implementation. Corner-bracket QR code frame is a clean affordance. Orange as the single accent in a near-black security modal is a precise, readable functional color choice — worth noting for Obsidian's security flow specifically.

---

### authenticator2.jpg — 2FA Modal in Dark File Manager

- **Layout:** Dark-themed app (file manager) with centered modal sheet for 2-step verification. Modal: QR code, manual code string (monospaced, hyphenated), blue "Continue" button. App context visible behind.
- **Color:** Dark navy (#0D1117) app and modal surface. Blue (#3B82F6) primary CTA, white text. Monospace code in white on dark.
- **Distinctive patterns:**
  - Monospace hyphenated secret key (LKS7-28HS-J910-HAXX-72LA-0HAJ-SCBH)
  - Modal as floating sheet over blurred-but-visible app context
  - QR code as primary input, text as fallback
- **Design language candidate:** NO — standard dark modal pattern.
- **Obsidian notes:** **KEY PATTERN.** Hyphenated monospace key format (groups of 4 separated by dashes) is the correct display pattern for Obsidian's secret keys, API tokens, and device IDs. Obsidian should standardize this chunking format using `--obs-font-data`.

---

### landingauth1.jpg — Property Finance Split Auth

- **Layout:** Two-panel split. Dark left (~35%): gradient illustration (dark green radial glow on near-black), headline, fine print at bottom. White right (~65%): logo, "Willkommen zurück" heading, username/password fields, green gradient CTA.
- **Visual character:** Property/finance SaaS authentication. Refined but conventional.
- **Color:** Near-black + deep green radial gradient on left panel. White right panel. Green-to-teal gradient CTA.
- **Distinctive patterns:**
  - Left panel gradient glow as brand illustration — organic, atmospheric, not literal illustration
  - Fine print at very bottom of left panel as legal/trust anchor
- **Design language candidate:** NO — competent split-auth, no distinct identity.
- **Obsidian notes:** Atmospheric gradient glow (single color radial burst on dark surface) is worth considering for Obsidian's auth/landing page left panel — more restrained than literal illustration and less generic than flat dark.

---

### landingauth2.jpg — Industrial Material Photography Auth

- **Layout:** Two-panel split. Left (~50%): full-bleed abstract industrial photography (corrugated metal or fabric with warm orange/rust lighting gradient). Right (~50%): white, centered form — email + CTA button + GitHub SSO option.
- **Visual character:** Vercel/Linear-style auth page. High quality abstract photography left. Ultra-minimal form right.
- **Color:** Left image: deep warm rust, amber, and charcoal. Right: pure white with black text and buttons.
- **Distinctive patterns:**
  - Abstract material photography (not product screenshots, not illustrations) as full-bleed left panel
  - Extreme contrast between rich textured left and clinical white right
  - Single email input as the auth primitive — zero friction
- **Design language candidate:** YES → **Ferrous**
  - After iron and oxidised metal. Warm rust and amber tones on dark industrial substrates, paired with clinical white precision on the opposite panel.
- **Obsidian notes:** STRONG RECOMMENDATION. Obsidian's authentication/landing page should use this pattern — abstract material photography (dark, textured, warm-to-neutral) on the left, clean white form on the right. Highest-quality auth page in the set and closest in spirit to Obsidian's material-world naming.

---

### asciilanding1.jpg — Dot-Matrix Halftone Auth (Light)

- **Layout:** Two-panel split. Left (~45%): white, centered minimal auth form (logo, "Welcome back", social auth buttons, email input, sign-in button). Right (~55%): dense dot-matrix rendered photographic landscape — architectural/brutalist scene with mountains.
- **Visual character:** High-art editorial. The dot-matrix right panel transforms a photograph into a halftone/pixel grid. White left is as minimal as possible.
- **Color:** Pure white left panel, grey tonal dot-matrix right panel. Absolutely monochromatic.
- **Typography:** Clean light sans-serif "Welcome back". Bold condensed style for "Sign in with email". No color in typography.
- **Distinctive patterns:**
  - Dot-matrix / halftone photograph rendering as full-bleed decorative panel
  - Achromatic auth form with no color
  - Halftone as artistic transformation of photography rather than illustration
- **Design language candidate:** YES → **Halftone**
  - After the printing technique. Photographs dissolved into dot fields — the image implied through density, not color. Richness without hue.
- **Obsidian notes:** Halftone/dot-matrix treatment could be powerful for Obsidian's illustration zones within cards and empty states — converting photographic content to dot-matrix maintains monochrome discipline while allowing photographic richness. A viable alternative to vector illustration.

---

### assciilanding2.jpg — Dot-Matrix Halftone Auth (Dark)

- **Layout:** Full-bleed dark composition. Left (~45%): white auth form panel (email, password, login button, GitHub SSO). Right (~55%): dark canvas with dot-matrix rendered classical architectural scene (Greek/Roman stone columns).
- **Visual character:** Dark counterpart to asciilanding1. Same dot-matrix technique but inverted. Classical architecture (Greek columns) adds gravitas.
- **Color:** Pure black (#000000) canvas, white dot-matrix illustration. White form fields on dark surface. White login button (inverted CTA).
- **Distinctive patterns:**
  - Dark canvas halftone variant (white dots on black)
  - Classical architecture as subject — permanence, authority, structure
  - Form embedded directly on the dark canvas (not on a contrasting white card)
  - White-filled login button as inverted CTA on dark surface
- **Design language candidate:** YES → **Colosseum**
  - After ancient Roman/Greek architecture: permanent, authoritative, stone-dark, rendered in white dot-matrix as if etched into the surface.
- **Obsidian notes:** Dark auth variant (form directly on dark canvas) is worth prototyping for Obsidian — where the dark surface IS the page, not just a card. White-filled login button (inverted vs. standard dark CTA) is a sharp, precise choice for dark surfaces.

---

## Pricing References

### pricing2.jpg — Dark Security/Blockchain Feature Grid

- **Layout:** Full-width dark section. Large headline (bold + light weight mixed). Below: four-column feature card grid — each with icon, numbered index (/01, /02, /03), title, bullet list, "Learn more" link. First card has a purple abstract illustration (spiral geometry).
- **Visual character:** Security/blockchain marketing page. Dark, technical, authoritative.
- **Color:** Near-black (#0D0D14) background and cards, white text, purple (#6B21A8) geometric illustration in card 1 only, subtle dark purple card border-glow effect. Near-monochrome with a single purple accent.
- **Distinctive patterns:**
  - Running numbered sequence ("/01", "/02", "/03") as organizational system
  - Geometric spiral illustration contained to a defined zone
  - "Learn more →" with diagonal arrow link pattern
  - Icon as category anchor without color
- **Design language candidate:** YES → **Vortex**
  - Dark substrate, purple depth, numbered sequences, technical authority with minimal decoration.
- **Obsidian notes:** Numbered sequence pattern ("/01", "/02", "/03") as a card/section organizing system is elegant and reusable for ordered lists, process flows, or step sequences in Obsidian. Diagonal arrow ("→" at an angle) on learn-more links is a clean directional affordance worth standardizing.

---

### pricing3.jpg — Mobile Conversion Dark Screen

- **Layout:** Mobile app screenshot. Dark background, dashboard elements visible at top (partly blurred, partly visible). Below fold: white text brand statement + two CTA buttons (Sign up, I have an account) at bottom.
- **Visual character:** Dark mobile conversion screen. Deep red-to-black gradient background with dashboard content floating above.
- **Color:** Deep crimson-to-black gradient (#8B0000 to #0A0A0A), white text, white outlined secondary button.
- **Distinctive patterns:**
  - Revenue/dashboard preview partially visible as background (shows product, creates aspiration)
  - Dark-to-light gradient from top edge
  - Two-button CTA pair (Sign up + "I have an account")
- **Design language candidate:** NO — strong mobile auth screen but not a distinct named language.
- **Obsidian notes:** "Product dashboard visible behind the auth/landing screen" pattern is a strong aspiration trigger. Deep crimson-to-black gradient is a dark-surface alternative with warmth without losing severity. Worth noting for Obsidian's mobile or tablet auth flow.

---

## Cross-Cutting Obsidian Improvement Findings

### Highest-priority improvements confirmed by these references

1. **Auth/landing page pattern** — use abstract material photography (Ferrous) or dot-matrix halftone imagery (Halftone/Colosseum) on the left panel. Both maintain monochrome discipline while carrying visual richness the current flat dark surface cannot achieve with color alone.

2. **Three-tier opacity hierarchy** (Graphite/sidebar2) — Active = full opacity, inactive = ~60%, disabled = ~35%. No color changes at any tier. Confirmed working at scale.

3. **Keyboard shortcut in search** (sidebar2) — "/" badge inside the search input. Small, precise, keyboard-first affordance.

4. **Numbered sequence pattern** (pricing2) — "/01", "/02", "/03" as card/step indices. A reusable rhythm for process flows, onboarding steps, and ordered feature lists.

5. **Card-level status border** (boardroom2 "Unstable" node) — A thin colored border-ring on a card for warning/error state. One tier above a badge but not full surface color. Currently missing from Obsidian's surface treatment. Critical for overdue invoice state.

6. **Audit log timeline** (layout2) — Icon + actor + action + timestamp in vertical timeline is the correct pattern for Obsidian's financial transaction history.

7. **Halftone illustration technique** (asciilanding1) — Dot-matrix treatment of photography or illustrations for Obsidian's contained illustration zones would maintain monochrome constraint while enabling richer visual content than vector illustration alone.

8. **Monospace secret key chunking** (authenticator2) — XXXX-XXXX-XXXX-XXXX hyphenated groups using `--obs-font-data` should be Obsidian's standard for all machine-generated keys, tokens, and references.

9. **Dashed-border as empty/placeholder container** (profile2) — More meaningful than a grey fill; signals "this zone will have content" without consuming visual weight.

10. **Single dark card rule confirmed by violation** (assets2) — Three competing dark cards at the bottom confirms that Obsidian's "one dark card per layout" rule is the correct constraint. The visual hierarchy collapses when the anchor is repeated.
