# Research: Invoice, Payment, Cards, KPI, Tracking

Reference images analyzed from `docs/design-refs/`. Each entry documents layout structure, hierarchy signals, color approach, typography, distinctive patterns, Obsidian fit, and relevance to invoice card design.

---

## receipt1.jpg — Boarding Pass / Transit Ticket

- **Layout:** Single centered card on dark page. Two horizontal zones: primary journey data (airport codes, times, route line) above a perforated separator; operational stub (gate, boarding time, barcode) below.
- **Hierarchy:** Size drives everything — airport codes at ~48px, times at ~28px, labels at 12–14px. A blue data band visually isolates operational fields.
- **Color:** Near-monochrome white card on near-black page. Single desaturated cornflower blue (~#7B9EBF) only on the operational data band and a "Direct" pill badge.
- **Typography:** Bold sans for codes and times, regular for labels and secondary text. No monospace present — though code fields (flight numbers, gate IDs) would benefit from it.
- **Distinctive patterns:**
  - Perforated tear line (notched edges + dashed line) as physical document metaphor
  - Two-zone architecture: primary data above tear, scan/stub below
  - Blue band as a self-contained "operational data region" distinct from journey data
- **Obsidian fit:** HIGH. Near-monochrome, hierarchy by size/weight only, single contained functional color, clear dark/light surface contrast.
- **Invoice card relevance:** YES. Two-zone split maps directly to invoice anatomy — summary top, reference/QR bottom. The perforated separator is applicable as a document-split affordance.

---

## receipt2.jpg — Game Cartridge Label

- **Layout:** Physical product label. Left: brand + QR code. Right: three-column metadata grid. Center strip: high-contrast yellow/lime illustration band.
- **Hierarchy:** Brand name anchors top-left. Metadata in tight uniform columns at ~10px — no hierarchy within the metadata block.
- **Color:** White label, black text, vivid yellow-green (#CCFF00) illustration strip. Fully contained.
- **Typography:** Wide condensed uppercase for brand. Monospace-adjacent or narrow sans for metadata columns.
- **Distinctive patterns:** Machine-readable spec-sheet layout. QR as a structural element, not an afterthought.
- **Obsidian fit:** MEDIUM. Physical-label aesthetic and contained illustration align. But this is a branding artifact, not a functional UI reference.
- **Invoice card relevance:** NO. Branding/product design, not a transactional document pattern.

---

## trackinginvoice1.jpg — Transit Ticket / Live Status Card

- **Layout:** Single white card on light grey page. Three sections top-to-bottom: train reference + date header; departure/arrival time pair flanking a duration line with status pill; passenger/seat/coach metadata row; split bottom zone — platform pill + boarding message left, QR code right.
- **Hierarchy:** Times (~32px bold) are the decision-critical values. Train ID and date are secondary. Labels are muted grey at small size.
- **Color:** White card, grey page, near-black text, green dot + text pill for "On time" status. Absolutely minimal. Subtle purple/blue gradient bar on card bottom edge only.
- **Typography:** Bold for times and seat values, regular for labels. Consistent sans-serif.
- **Distinctive patterns:**
  - Departure/arrival symmetry with connecting duration line as central axis
  - QR code as structural bottom-right anchor
  - Status pill (green dot + "On time") as textbook functional-color-in-badge
- **Obsidian fit:** HIGH. Almost native Obsidian: white card, weight/size hierarchy, color only in a status badge, dense but scannable.
- **Invoice card relevance:** YES. Departure/arrival symmetry → issuer/recipient or issued/due-date pair. Status pill → invoice state badge (Draft / Sent / Overdue / Paid).

---

## trackingstatus1.jpg — Dark Navigation Overlay Card

- **Layout:** Dark card with map background bleeding right. Left half: vertical timeline (three labeled nodes on dashed connector line). Right half: map visualization with glowing route.
- **Hierarchy:** Destination node brightest (white fill). Current action has most text weight. Speed secondary. "20 minutes" isolated via size contrast bottom-right.
- **Color:** Near-black (#1A1A1A) card, white text, teal/cyan (#00E5C8) route glow on map. Color is functional — teal = active route path. Grey muted for future steps.
- **Typography:** White on dark, sizes differentiate levels but subtly — weight carries more hierarchy than size at this density.
- **Distinctive patterns:**
  - Vertical timeline with dashed connector as progress metaphor
  - Map bleed as contextual data, contained within card boundary
  - High information density in a small footprint
- **Obsidian fit:** HIGH. Dark card native, hierarchy without decorative color, teal is functional (active = live route). Map bleed is contained illustration.
- **Invoice card relevance:** MEDIUM-HIGH. The vertical dashed timeline maps directly to invoice lifecycle stages: Drafted → Sent → Viewed → Paid.

---

## ticket1.jpg — Museum Admission Ticket (Two Variants)

- **Layout:** Horizontal landscape ticket. Left zone (~70%): brand mark, reference code, QR bottom-left, metadata bottom-right. Right zone (~30%, dark/black): rotated stub with barcode, QR repeat, reference code, class/time details.
- **Hierarchy:** Brand identity leads. Reference code is the machine identity of the document. Ticket class differentiated by accent color band, not text weight.
- **Color:** Cream/off-white left zone, black right stub. Class differentiation: lime green (#A8FF3E) for General, powder blue (#B8D4F0) for Student — full-bleed band along bottom edge.
- **Typography:** Bold condensed black for brand. Monospace or data-style for reference number (000000114351). Small regular sans for operational metadata.
- **Distinctive patterns:**
  - Light-body / dark-stub two-toned horizontal split
  - Reference number as code identity — spaced, monospace-adjacent
  - Color band as ticket-type signal (contained, semantic)
- **Obsidian fit:** MEDIUM. Two-toned physical ticket and reference-code treatment align. Color bands as primary differentiator (vs. Obsidian's type weight or surface contrast) is the violation.
- **Invoice card relevance:** YES. Light-body + dark-stub split is a direct structural template for a two-section invoice card. Reference number treatment is a literal pattern for invoice IDs.

---

## payment1.jpeg — Subscription Payment / Billing Form (Dark UI)

- **Layout:** Two-panel card. Left: dark gradient illustration (product/tier branding). Right: structured form — plan selector with pricing rows, card detail fields, billing address, CTA.
- **Hierarchy:** Plan selector uses selection state (filled radio + highlighted row). Prices right-aligned bold. CTA is terminal action.
- **Color:** Near-black throughout. Left panel: purple-to-dark gradient (decorative). Right panel: dark grey inputs, purple selection state, purple CTA. Purple used across multiple surface types — not contained to badges.
- **Typography:** Medium sans-serif. Prices in regular weight — no monospace on financial values (a miss vs. Obsidian standards).
- **Distinctive patterns:**
  - Two-panel split: pure illustration left, pure function right
  - Plan selector as inline radio-with-price-row
- **Obsidian fit:** LOW-MEDIUM. Dark surfaces align. Purple used simultaneously as decorative and functional violates functional-color containment. Missing monospace on financial data.
- **Invoice card relevance:** MEDIUM. Price-row-with-selection and two-panel functional split apply to payment method selection on an invoice, not invoice card design itself.

---

## payment2.jpeg — Credit/Debit Card Hardware UI

- **Layout:** Single centered payment card on dark background with glow effect. Card anatomy: cardholder name + expiry top-right, balance large left, card number below, brand mark bottom-right.
- **Hierarchy:** Balance ($171,234.54) dominates — large, white, bold. Card number secondary in spaced monospace-style groups.
- **Color:** Near-black card on near-black page with ambient orange-red glow (purely decorative background illustration). Card face is monochrome.
- **Typography:** Large display weight for balance. Card number in spaced groups (monospace-adjacent). Labels in small regular.
- **Distinctive patterns:**
  - The card IS the dark card — the decision-critical object
  - Orange glow as illustration device contained to background
  - Card number in grouped monospace format as identity display
- **Obsidian fit:** MEDIUM-HIGH. Dark card with large financial data is directly on-brand. Decorative glow on page background is the only violation.
- **Invoice card relevance:** MEDIUM. Balance display pattern is useful; this is account identity not invoice data. The grouped monospace number format applies to invoice/reference IDs.

---

## payment2.jpg — Task Tracking / Workflow Card with Timeline

- **Layout:** White modal card. Header: title + action icons. Progress bar (4 stages, full width). Metadata rows (assigned, due date, priority badge). Description block. Vertical timeline of 4 events with right-aligned dates.
- **Hierarchy:** Title largest. Progress bar fill (solid = completed, outline = pending). Event titles bold, descriptions muted. Dates right-aligned.
- **Color:** White card, grey page. Purple (#6C63FF) extensively: progress bar fill, completed event dots, CTA. Priority shown as amber outlined pill. Color used beyond badge scope.
- **Typography:** Bold for stage labels and event titles, regular for descriptions. Dates in numeric-focused style but not true monospace.
- **Distinctive patterns:**
  - 4-step progress bar above the vertical timeline (dual representation of same state)
  - Vertical timeline with node states: filled = complete, ring = current, empty = future
  - Date/time pairs right-aligned to events
- **Obsidian fit:** LOW. Purple used extensively (not badge-contained). The timeline pattern itself is highly Obsidian-compatible.
- **Invoice card relevance:** MEDIUM. The 4-stage progress bar and vertical state timeline map directly to invoice lifecycle: Draft → Sent → Viewed → Paid.

---

## payment3.jpeg — Investment/Savings Card (Annotated Design Spec)

- **Layout:** Dark rounded card with designer annotations. Large balance top-left. APR + earnings labels below. Histogram bar chart in center. "Unlock at" date and maturity percentage at bottom.
- **Hierarchy:** Balance ($21,353.88) is dominant. APR/earned is secondary metadata. Bar chart signals data richness. Date and maturity are operational context.
- **Color:** Explicitly annotated — card background: #FFFFFF at 0.8 opacity (semi-transparent dark); bars: #FF6F42 (orange); earned label: #58C830 (green). Both colors in specific data indicators, not on surfaces. Functional only.
- **Typography:** Monument Grotesk for balance, Inter for labels. No explicit monospace but financial formatting implies data-font intent.
- **Distinctive patterns:**
  - Semi-transparent card creating depth without a true dark surface
  - Histogram of time-series data within card body
  - "Unlock at" as a time-gated constraint indicator
  - Annotation style reveals the token intentions of the designer
- **Obsidian fit:** HIGH. Functional-only color, near-monochrome card, balance as dominant value, time-gated value at bottom. Semi-transparent dark surface closely matches `--obs-surface-card-dark`.
- **Invoice card relevance:** YES. Large balance + labeled secondary metrics + time-gated value (due date) + progress bar = direct structural template for an invoice dark card variant.

---

## payment3.jpg — Virtual Card Creation Modal

- **Layout:** White modal over card list. Tab switcher (Card Preview / Apple Wallet). Large dark card preview (~40% of modal height). Below: form — Card Name, Color selector (dot grid), bank account link + balance, Create Card CTA.
- **Hierarchy:** Card preview is dominant. Form fields secondary. CTA is terminal action.
- **Color:** White modal, dark card preview, color selector showing 9 options. Black CTA. Restrained outside the color-picker.
- **Typography:** Bold for modal title and card type label. Regular for form content. No monospace.
- **Distinctive patterns:**
  - Live preview of card as you configure (card as interactive preview object)
  - Color selector as compact dot-grid
  - Card thumbnails in list view behind modal: small dark rectangles
- **Obsidian fit:** MEDIUM. White modal + dark card preview align with dark/light duality. Card preview as primary visual anchor is pure Obsidian.
- **Invoice card relevance:** NO. Card configuration UI, not invoice display.

---

## payment4.jpg — Boarding Pass Pair (Light/Dark Duality)

- **Layout:** Two cards side by side on white page. Left card: white, departure info + urgency bar + origin/destination selector list. Right card: black, compact itinerary (destination, seat, date) + large QR code.
- **Hierarchy:** Left card — "Next Destination: Bali" and "Counter closes at 8:00 PM" are urgency signals. Red countdown ("20m left") with segmented urgency bar. Right card — destination and seat top, QR fills bottom half.
- **Color:** White left card, black right card. Red/salmon (#FF6B6B) only on countdown indicator and urgency bar fill — purely functional time-pressure signal.
- **Typography:** Bold for destination names and times. Regular for labels. Right card uses white-on-black with clean weight differentiation.
- **Distinctive patterns:**
  - **Direct implementation of Obsidian's dark/light card duality** — light card: human-readable journey info; dark card: machine-readable QR + reference data
  - Segmented urgency bar as time-remaining visualization
  - Red used only on time-pressure signals (functional, contained)
- **Obsidian fit:** HIGH. Light + dark card pair, functional red only on urgency countdown, clean typographic hierarchy. Near-reference implementation of Obsidian's card duality.
- **Invoice card relevance:** YES. Light/dark pair — light card shows invoice details, dark card shows QR/reference code. Segmented bar maps to payment deadline urgency.

---

## cards.jpeg — LMS Dashboard (Purple Dark Theme)

- **Layout:** Multi-panel dark dashboard. Left: heatmap grid (Weekly Engagement). Below: 4 KPI tiles (2×2 grid). Center: navigation sidebar. Right: calendar + event list + activity card.
- **Hierarchy:** Each KPI tile has a large number + colored percentage delta below.
- **Color:** Dark purple/violet theme throughout. Heatmap uses purple intensity as data dimension. KPI deltas use green (positive) and red (negative). Heavy color usage as hierarchy signal.
- **Distinctive patterns:** 2×2 KPI tile grid. Heatmap grid as calendar-density visualization. Delta pattern on every tile.
- **Obsidian fit:** LOW. Color used pervasively as hierarchy and decoration. Purple surfaces are decorative. Conflicts with Obsidian's neutrality.
- **Invoice card relevance:** LOW. KPI tile structure is reusable but the color system is incompatible.

---

## cards1.jpeg — Revenue Chart Card (Extreme Minimalism)

- **Layout:** Single white card on light grey page. Two zones: header (label "REVENUE", period tabs, large percentage figure); chart zone (dotted column chart with two period labels and dollar values).
- **Hierarchy:** +326% in very large display weight is the single dominant value. Everything else is secondary. The dotted chart is visual context, not a primary signal.
- **Color:** Pure greyscale. White card, light grey page, dark grey/black text, grey dots for chart. Zero color.
- **Typography:** "REVENUE" in small caps/uppercase tracking. +326% at very large display weight. Chart labels in small monospace-adjacent numerics (MAY $3,250, JUN $12,392).
- **Distinctive patterns:**
  - Dotted column chart — each column made of dots rather than solid bars (lightweight, zero color)
  - Extreme restraint: no borders except card container, no icons, no color
  - Two-period comparison anchors ($3,250 → $12,392) as axis labels
- **Obsidian fit:** HIGH. Arguably the purest expression of Obsidian-compatible design in the reference set: zero decorative color, hierarchy through size/weight alone, near-monospace data.
- **Invoice card relevance:** YES. Label + large value + supporting period comparison pattern maps to an invoice summary card header zone.

---

## cards2.jpg — Technical Label / Data Sheet (Brutalist Aesthetic)

- **Layout:** Square card mimicking a machinery spec label or equipment plate. Multiple zones separated by ruled lines: brand header zone, two-column technical data (INPUT/OUTPUT/ID left, SERVICE SCOPE + description right), collaborator strip, CAUTION notice block.
- **Hierarchy:** Brand name dominant. Data fields all-caps label/value pairs at uniform small size — no hierarchy within the data block. CAUTION block uses a dark band as emphasis.
- **Color:** Light sage/teal grey background, black text and rules, white CAUTION band. Zero decorative color.
- **Typography:** Condensed uppercase throughout — industrial/technical aesthetic.
- **Distinctive patterns:**
  - Industrial spec-sheet layout — INPUT / OUTPUT / ID as structured metadata fields
  - CAUTION block as warning/notice zone with dark band
  - Version number (VER 03) as small metadata element
  - Ruled separators as zone dividers
- **Obsidian fit:** MEDIUM-HIGH. Zero color, monochrome, dense, structured. Brutalist rather than Obsidian but principles (restraint, structure-led hierarchy, no decoration) are aligned.
- **Invoice card relevance:** YES. INPUT/OUTPUT/ID metadata grid with ruled separators is a direct structural reference for invoice detail fields. The spec-label treatment of an invoice as a "document identity" object is a strong design direction.

---

## cards3.jpeg — Dark Feature Card Grid (Focus Card Highlight)

- **Layout:** Grid of dark cards with line-art illustrations. One center card is vivid amber/yellow — the featured state.
- **Hierarchy:** Featured card breaks visual rhythm through surface color change (yellow vs. dark). Within each card: icon, title, body, "READ ARTICLE" CTA.
- **Color:** Background and most cards at ~#111. Featured card is amber (#F5B700). Line-art icons white on dark, filled orange on featured card.
- **Distinctive patterns:** Uniform grid where one card breaks rhythm through surface swap. The "one bright card per dark layout" principle (inverted version of Obsidian's dark card anchor).
- **Obsidian fit:** MEDIUM. "One highlighted card per layout" is directly Obsidian-aligned in principle. But amber as hierarchy signal conflicts with Obsidian's badge-containment rule.
- **Invoice card relevance:** NO directly. Selected-invoice surface swap pattern could apply to invoice list, not invoice card anatomy.

---

## cards4.jpg — DeFi Treasury / Financial Data Dashboard

- **Layout:** Two adjacent dark cards. Left (wider): entity header, risk rating, three data metrics (Total Deposited, APY, Performance), tab navigation, large TVL/APY/Reserves display. Right (narrower): three data points (deposits, locking period, pending rewards) + three CTA buttons (Deposit, Claim, Withdraw).
- **Hierarchy:** Left card — three large values co-equal. Right card — $32,580 deposit leads. CTA buttons are terminal actions.
- **Color:** Near-black cards, white text. Performance +4.34% green, pending rewards $2,580 amber/orange. Functional and contained within data cells.
- **Typography:** All-caps small labels (TOTAL DEPOSITED, APY, PERFORMANCE). Values large weight. Numbers in comma-spaced monospace-adjacent style.
- **Distinctive patterns:**
  - Companion card layout — primary data card + action sidebar card
  - All-caps label above each value as financial KPI pattern
  - Tab navigation for switching data views within a single card
  - Risk rating as starred-count pattern
- **Obsidian fit:** HIGH. Dark cards, near-monochrome, functional color only on indicators, large values dominant, all-caps labels above values. Strong alignment with Obsidian financial principles.
- **Invoice card relevance:** YES. All-caps label + large value pattern, companion action-card layout, color-on-indicator (not on surface) approach — all directly applicable.

---

## progresscard1.jpg — Progress/Goal Tracking Card

- **Layout:** Dark card with subtle border. Top: category tags + title + menu. Body: status sentence, large percentage + delta badge inline. Bottom: segmented progress bar full-width.
- **Hierarchy:** "71%" is dominant. Status sentence is human-readable context. Segmented bar is the visual encoding of 71%. Delta badge is a secondary qualifier.
- **Color:** Black card (#111), white text, grey/dark grey segmented bar — lighter segments for completed, darker for remaining. **Zero color anywhere**, including tags (outlined pill borders only).
- **Typography:** Large display weight for 71%. Regular for status sentence. Small for delta badge and tags.
- **Distinctive patterns:**
  - Segmented bar (not solid bar) — light/dark segment contrast carries progress state without color fill
  - Tag + title + percentage + bar + delta = complete progress card architecture
  - Delta badge: arrow + number in a bordered box
- **Obsidian fit:** HIGH. Near-perfect Obsidian: dark card, zero color, hierarchy by weight/size only, tags as pill badges without color, progress through surface contrast.
- **Invoice card relevance:** YES. Percentage progress + segmented bar + delta badge maps to payment progress on a partial-payment invoice (X% paid, $Y remaining).

---

## processing1.jpg — Onboarding Step Wizard with Payment Selection

- **Layout:** White modal card, two-column. Left: vertical step list with state icons. Right: payment method selection (radio list). Bottom: back button + primary CTA.
- **Hierarchy:** Modal title leads. Active step highlighted with dark filled circle + bold text. Completed steps show green check icons.
- **Color:** White modal, light purple page. Green for completed steps, dark navy for active, blue for selected radio. Step states use color functionally.
- **Distinctive patterns:**
  - Dashed connector line between incomplete step circles
  - Two-column split: navigation context left, step content right
  - Active step row anchored with a dark filled icon
- **Obsidian fit:** MEDIUM. White card aligned. Step-state icons use color functionally (acceptable in Obsidian for status). Purple accent page and blue CTA add chromatic load beyond Obsidian's restraint.
- **Invoice card relevance:** NO. Step wizard for invoice creation flow, not invoice card display.

---

## kpi1.jpeg — Insight/Forecast Card (Dark with Gradient)

- **Layout:** Square dark card. Header: icon + "Insight" label left, time period selector + menu right. Body: very large percentage ("89%") with trend arrow. Below: bold description sentence + muted explanation text. Bottom: pagination dots.
- **Hierarchy:** 89% occupies ~half the card height. Bold key phrase in the sentence below. Muted small text for supporting detail. Three-tier editorial hierarchy: number → bold phrase → muted context.
- **Color:** Dark card with a green-amber gradient radial glow in upper portion (decorative, not functional). Trend arrow is teal/green. Text is white and light grey. Gradient acts as a spotlight directing attention — intent is functional but execution is decorative.
- **Distinctive patterns:**
  - Editorial narrative structure: number tells WHAT, bold phrase tells WHY, muted text tells HOW
  - Gradient spotlight on the key value (Obsidian would achieve via type size/weight only)
- **Obsidian fit:** MEDIUM. Dark card and typographic hierarchy aligned. Gradient background is decorative — Obsidian rejects this. The editorial three-tier narrative structure is directly portable.
- **Invoice card relevance:** MEDIUM. "Dominant value + bold context phrase + muted detail" editorial hierarchy applies to a featured invoice KPI card.

---

## kpi2.jpg — Crypto Exchange Dashboard (Dark with Photo Background)

- **Layout:** Full-page dark dashboard. Top ticker bar (scrolling prices with green/red percentages). Below: account balance card zone with background photo bleed. Tab navigation. Below: bar chart + line chart side by side.
- **Hierarchy:** Account balance ($32,592.00) is dominant via size and hero zone position. +$6,203.00 (23.51%) secondary. Charts are supplementary context.
- **Color:** All dark surfaces. Green for positive, red for negative in ticker — purely functional financial polarity. Background photo behind balance is decorative (contained to that zone). Orange lens flare is decorative illustration.
- **Distinctive patterns:** Balance in a hero zone with photographic/illustration background. Ticker bar as persistent data strip at page top.
- **Obsidian fit:** MEDIUM. Dark surfaces and functional green/red aligned. Photographic background in the hero zone is a violation — decorative rather than purposeful. Confirms Obsidian's illustration containment rule.
- **Invoice card relevance:** LOW. Dashboard layout, not invoice card pattern.

---

## kpi3.jpeg — Budget Tracking Card (Dark with Progress Bar)

- **Layout:** Dark card with light inner border framing. Header: "Q4 Budget" left, "59% spent" badge right. Body: two-column value pair (Expenses total left, Budget total right), both large amounts. Below: horizontal progress bar (purple fill, dashed for remaining). Bottom: tag pill + avatar cluster.
- **Hierarchy:** Two values co-equal — $3,520 (expenses) and $6,000 (budget) — intentional comparison pair. The 59% spent badge in the header resolves the comparison into a summary.
- **Color:** Dark card (~#0D0D0D), white primary text, purple (#8B5CF6) progress bar fill, green arrow on delta indicator. Badge is a dark outlined pill.
- **Distinctive patterns:**
  - Intentional value pair as a comparison — two values meant to be read together
  - Dashed/segmented remaining portion of progress bar (dark dashes on dark, subtle)
  - Tag pill + avatar strip as metadata footer
- **Obsidian fit:** HIGH. Dark card, purple only in the progress bar (functional fill = spent), large values dominant, label pattern aligned. Value-pair comparison is directly on-brand.
- **Invoice card relevance:** YES. Expenses vs. budget comparison maps directly to amount-paid vs. invoice-total. Progress bar for partial payment is a direct template.

---

## kpicta1.jpg — Glassmorphism UI Mockup Template

- **Layout:** Single centered glassmorphic card on a 3D-rendered dark background. A floating pill label at the bottom edge.
- **Color:** Dark background (rendered black shattered stone). Glass card semi-transparent. Yellow-green (#CCFF00) for one decorative word.
- **Distinctive patterns:** Glassmorphism — backdrop blur + semi-transparent card. Floating pill at card bottom edge.
- **Obsidian fit:** LOW. Glassmorphism is decorative and adds visual noise. Blurred transparency contradicts Obsidian's clear surface hierarchy (#FFFFFF vs #111111). Decorative color accent conflicts.
- **Invoice card relevance:** NO. This is a design mockup template, not a UI reference.
- **Note:** However, a *restrained* frosted glass application — e.g., a modal overlay or a contextual tooltip — could be considered for Obsidian's glass surface treatment, distinct from full glassmorphism.

---

## kpicta2.jpg — Budget Warning Card (Pixel/Retro Aesthetic)

- **Layout:** Dark rounded card on halftone dithered split background. Card: pixel-style "BUDGET" title, SPENT/LIMIT value pair inline, dithered/segmented progress bar, warning message, "DETAILS" pill CTA.
- **Hierarchy:** BUDGET title leads visually via pixel font. SPENT and LIMIT co-equal. Progress bar encodes ratio. Warning message is contextual text.
- **Color:** Black card, white text. Dithered progress bar uses pixel pattern for fill — no color, just density. Background dither is stylistic but contained to outside the card. Completely monochrome.
- **Typography:** Pixel/dot-matrix display font throughout. ALL CAPS. Monospace character width.
- **Distinctive patterns:**
  - Dithered progress bar — pixel density (dense = spent, sparse = remaining) without any color
  - SPENT/LIMIT comparison pair as the core data architecture
  - "Terminal" or "hardware display" metaphor
- **Obsidian fit:** MEDIUM-HIGH on principle. Monochrome, data-first, non-color progress bar — all aligned. Pixel font is aesthetic Obsidian would not use, but the structural thinking is directly compatible.
- **Invoice card relevance:** YES. SPENT/LIMIT comparison with non-color progress bar is a direct template for invoice partial-payment state. The warning message pattern applies to overdue/urgency signals.

---

## Cross-Cutting Synthesis

### Strongest Obsidian fits (HIGH)
receipt1, trackinginvoice1, trackingstatus1, payment3.jpeg, payment4.jpg, cards1.jpeg, cards4.jpg, progresscard1.jpg, kpi3.jpeg

### Most directly relevant to invoice card variants

| Reference | Pattern contribution |
|---|---|
| payment4.jpg | Light/dark duality split — the template for a two-panel invoice card |
| progresscard1.jpg | Progress percentage + segmented bar + delta badge — payment progress |
| receipt1.jpg | Two-zone anatomy with perforated separator and reference stub |
| payment3.jpeg | Dominant balance + secondary metrics + time-gated value — dark card anchor |
| kpi3.jpeg + kpicta2.jpg | Spent/remaining comparison with non-color progress bar |
| trackinginvoice1.jpg | Status pill pattern, issued↔due date pair symmetry |
| cards1.jpeg | Extreme minimalism: label + large value + two-period comparison |
| cards4.jpg | All-caps label above value, companion action-card layout, functional color on indicators |
| ticket1.jpg | Light-body/dark-stub split with reference code as document identity |
| trackingstatus1.jpg | Vertical dashed timeline for payment lifecycle stages |

### Patterns to reject or adapt for Obsidian

| Pattern | Reason |
|---|---|
| Glassmorphism (kpicta1) | Decorative; destroys surface hierarchy clarity |
| Purple/violet bleeding onto surfaces (cards.jpeg, payment1, payment2.jpg) | Functional color must stay in badges/indicators |
| Gradient backgrounds on card faces (kpi1, payment2.jpeg) | Illustration contained, not the surface itself |
| Photographic backgrounds within functional cards (kpi2) | Violates surface clarity |
| Color as ticket-type differentiator across card surfaces (ticket1, cards3) | Use surface weight (light/dark) and type weight instead |
