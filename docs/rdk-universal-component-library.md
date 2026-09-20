# Angular RDK — Universal UI Component Library
### Full atomic-design inventory: build any enterprise web software from this base

Scope shift from the restaurant catalog: this is **domain-agnostic**.
Everything here is foundation — the layer RDK ships regardless of what
gets built on top. Domain-specific components (like the restaurant
list) become an optional provisioning module layered on this
foundation per-project, not part of the core.

Note: Brigade's existing organisms (KPICard, DataTable, NotificationPanel,
ConfirmDestructiveModal, EmptyState, LoadingSkeleton, Toast) aren't
restaurant-specific at all — they belong in this universal set. They're
marked **[existing]** below rather than re-listed as new work.

---

## 1. Atoms

### 1.1 Typography
Heading · Body Text · Label · Caption · Numeric/Mono Text · Inline Code · Link · Kbd (keyboard-key glyph) · Blockquote text

### 1.2 Iconography & Media
Icon · IconBadge **[existing]** · Avatar **[existing]** · AvatarGroup stack · Image (with lazy-load/fallback) · Logo mark · Illustration placeholder · Video thumbnail · Favicon/AppIcon display

### 1.3 Buttons & Actions
Button (primary/secondary/ghost/danger) **[existing]** · IconButton · LinkButton (styled as text, behaves as button) · FAB (floating action button) · ToggleButton (pressed/unpressed state)

### 1.4 Form Input Atoms
TextInput · PasswordInput (with visibility toggle) · NumberInput · Textarea **[atom]** · SearchInput · EmailInput · PhoneInput (with country code) · URLInput · PinInput/OTP digit · MaskedInput (custom format, e.g. card number) · CurrencyInput · DatePicker · DateRangePicker · TimePicker

### 1.5 Selection Atoms
Checkbox **[existing]** · Radio **[existing]** · ToggleSwitch · native Select · Slider/RangeInput · Rating (stars) · ColorSwatch/picker trigger · Stepper (quantity +/−)

### 1.6 Status & Indicators
Badge/Pill **[existing]** · StatusDot **[existing]** · ProgressBar (linear) · ProgressCircle (radial) · Spinner **[existing]** · Skeleton block **[existing]** · Divider **[existing]** · CountdownTimer · Tag/Chip

### 1.7 Layout Primitives
Container · Grid cell · Spacer · AspectRatioBox · CardShell **[existing]** · Panel · DragHandle

**Section total: 51 atoms** (11 existing, 40 new)

---

## 2. Molecules

### 2.1 Form Molecules
FormField (label+input+error) **[existing pattern]** · SearchBar (input+icon+clear) · DateField · DateRangeField · FileUploadField · ImageDropzone · TagInput · QuantitySelector · PriceInput · PasswordStrengthMeter · OTPGroup (multi-digit) · ButtonGroup · SplitButton (primary action + dropdown of related actions) · Combobox/Autocomplete input · MultiSelect chip field · Signature pad field

### 2.2 Navigation Molecules
Breadcrumb · TabItem **[existing pattern]** · MenuItem **[existing pattern]** · PaginationControl **[existing]** · StepIndicator (wizard progress dots/bar) · NavItem (sidebar/topnav entry) · DropdownTrigger (label + chevron)

### 2.3 Data Display Molecules
StatBlock (KPI core) **[existing]** · DeltaBadge **[existing]** · AvatarBadgeOverlay **[existing]** · ListItem (generic row) · TimelineStep **[existing]** · TreeNode (expandable row) · RatingSummary · KeyValueRow (label/value pair, e.g. metadata panels) · ChipList (removable tag collection) · CardHeader **[existing]**

### 2.4 Feedback Molecules
AlertBanner (persistent, page-level) · ToastMessage **[existing, as Toast organism-lite]** · InlineConfirmation (e.g. "Saved" flash) · EmptyStateBlock **[existing]** · ErrorMessageBlock (form/page-level error summary) · ProgressStep (wizard step state: done/current/pending)

**Section total: 33 molecules** (9 existing/existing-pattern, 24 new)

---

## 3. Organisms

### 3.1 Navigation Organisms
TopNavBar · Sidebar/NavRail (collapsible) · BreadcrumbsBar · TabGroup **[existing pattern]** · CommandPalette (Cmd+K global search/actions) · MegaMenu (multi-column dropdown nav) · ContextMenu (right-click) · MobileNavDrawer

### 3.2 Data Organisms
DataTable/DataGrid **[existing]** · KanbanBoard (drag-drop columns/cards) · Calendar (month/week/day views) · TreeView · Timeline (activity/audit sequence) · CardGrid (responsive card collection) · ChartCard **[existing]** (sub-types: Bar, Line, Area, Pie/Donut, Scatter — same organism, different chart-body renderer) · ComparisonTable · ActivityFeed · CommentThread

### 3.3 Overlay Organisms
Modal/Dialog (generic) · ConfirmDestructiveModal **[existing]** · Drawer/Sidesheet · Popover · DropdownMenu · Tooltip (rich/multi-line variant) · Lightbox/ImageViewer · CommandPalette *(cross-listed with 3.1)*

### 3.4 Form Organisms
MultiStepForm/Wizard · FilterBuilder (query-builder UI for advanced search) · FormBuilder (drag-drop form designer, if RDK targets no-code use cases) · SearchFiltersPanel · BulkActionToolbar (appears on multi-row table selection) · RichTextEditor · CodeEditor (syntax-highlighted) · FileUploaderWithProgress (multi-file, progress per item) · ImportExportWizard (CSV/data mapping flow)

### 3.5 Content Organisms
HeroSection · PricingTable · FAQAccordion · TestimonialCard · StatGroup (KPI row) **[existing]** · NotificationPanel **[existing]** · NotificationItem **[existing]** · OnboardingChecklist · FeatureTour/Walkthrough (spotlight overlay) · ChangelogViewer

### 3.6 Auth & Account Organisms
LoginForm · SignupForm · MFAForm (code entry, device selection) · PasswordResetForm · SSOButtonGroup (Google/Microsoft/SAML entry points) · SessionExpiredModal · ProfileCard · AccountSettingsForm

### 3.7 Admin & Enterprise-Grade Organisms
UserManagementTable · RoleEditor · PermissionsMatrix **[existing]** · AuditLogViewer · APIKeyManager · WebhookConfigPanel · IntegrationCard / IntegrationMarketplaceGrid · BillingPlanCard · InvoiceTable · UsageMeter (quota/consumption bar) · OrgChart (hierarchical node tree) · TenantSwitcher (multi-org account switching) · EnvironmentBadge (dev/staging/prod indicator) · FeatureFlagToggleList · WorkflowBuilder/PipelineEditor (node-based flow editor) · SavedViewsList (persisted filter/table configs) · GlobalSearch (cross-entity search results panel)

**Section total: 62 organisms** (9 existing, 53 new)

---

## 4. Templates

AppShellTemplate (nav + content region skeleton) · DashboardTemplate **[existing]** · ListTemplate **[existing]** · DetailTemplate **[existing]** · SettingsTemplate · AuthTemplate (centered card, login/signup/reset variants) · OnboardingTemplate · WizardTemplate (multi-step flow shell) · ErrorPageTemplate (404/403/500 variants) · MaintenanceTemplate · PricingPageTemplate · AdminTemplate (admin-console shell, distinct from standard app shell)

**Section total: 12 templates** (3 existing, 9 new)

---

## 5. Cross-Cutting Systems (not components — supporting infrastructure)

These aren't in the component count but every organism above depends
on them existing first:

- **Theme engine** — already defined (Brigade's structure/skin split, theme-file contract)
- **i18n/localization layer** — string extraction, RTL layout support (affects every molecule/organism with text or directional icons)
- **Accessibility baseline** — focus management, ARIA patterns per organism type (especially Modal, Drawer, CommandPalette, DataTable, Combobox — these have the most complex a11y requirements in the whole set)
- **Motion system** — already defined (durations/easings)
- **Form validation framework** — schema-driven validation feeding every Form Molecule/Organism's error states consistently

---

## 6. Summary

| Tier | Total | Existing (Brigade) | New for RDK |
|---|---|---|---|
| Atoms | 51 | 11 | 40 |
| Molecules | 33 | 9 | 24 |
| Organisms | 62 | 9 | 53 |
| Templates | 12 | 3 | 9 |
| **Total** | **158** | **32** | **126** |

---

## 7. Build Priority Note

Not requested, but worth flagging given the size: an RDK's actual
value is in the **20–30 components nearly every project needs**, not
full coverage on day one. Recommend a first release scoped to:

- All Atoms except the rarer ones (Signature pad, MaskedInput, ColorSwatch)
- Form + Navigation + Feedback Molecules
- DataTable, Modal/Dialog, TopNavBar, Sidebar, NotificationPanel, LoginForm, DashboardTemplate, ListTemplate, DetailTemplate, AuthTemplate

That's roughly 60 of the 158 — enough to actually ship a real product
end-to-end. Everything else (WorkflowBuilder, OrgChart, FormBuilder,
CommandPalette) is genuinely valuable but should wait for a project
that actually needs it, or RDK's early releases will spend most of
their time on components nobody's using yet.

---

## Glossary

- **Provisioning module**: a domain-specific component set (like the
  restaurant catalog) that installs on top of this universal
  foundation for a given project, without modifying the foundation
  itself.
- **Cross-cutting system**: infrastructure (theming, i18n, a11y,
  motion, validation) that every component depends on but that isn't
  itself a component — gets built once, consumed everywhere.
