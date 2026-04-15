# Claude Implementation Prompt — elinorsilow.com Refactor

You are working on a **Next.js (App Router) + React + Tailwind + Framer Motion** project.

Your task is to refactor and extend the UI system according to the following **strict, step-by-step instructions**.

Follow all naming exactly. Reuse existing components where specified. Do not break existing functionality.

---

## 1. Favicon Setup

1. Locate `/public/Vector.svg`
2. Rename it to `favicon.ico`
3. Move it to `/app` (App Router root)
4. Ensure Next.js picks it up automatically as the site favicon

---

## 2. Create `PageHeader` Component

### 2.1 Extract Existing Logic

1. Open `DesktopNav`
2. Find the “page header section”
3. Extract it into a new component:
   - `components/PageHeader.jsx` (or `.tsx`)

---

### 2.2 Base Behavior

- Make `PageHeader`:
  - `position: fixed`
  - Always visible
  - Rendered on both mobile and desktop

---

### 2.3 Mobile Layout

Implement:

- Top-center positioning

- Breadcrumb text:
  - Format: `elinor silow / works`, `exhibitions`, `info`, etc.

- Below or alongside:
  - Current visible Work/Exhibition title

Use:

- `OGubbeText` component

---

### 2.4 Title Truncation Logic

Implement a utility:

- If title has **more than 3 words**:
  - Replace with `(...)`
  - Apply vertical gradient fade (mask or overlay)

---

### 2.5 Desktop Layout

- Render `PageHeader` inline with:
  - menu
  - filter
  - search

- Align horizontally with existing nav

---

## 3. Create `DynamicGrid` Component

### 3.1 File

- `components/DynamicGrid.jsx`

---

### 3.2 Replace Existing Grid

- Use this component for:
  - `/` (works page)
  - `/exhibitions`

- Remove ALL scroll snapping logic

---

### 3.3 Grid Controls

Connect to `FilterBox`:

- Existing:
  - `add-grid-cols`

- Create:
  - `add-grid-rows`

---

### 3.4 Constraints

- Max columns: 4

- Max rows: 4

- Defaults:
  - Desktop: `grid-cols-3 grid-rows-1`
  - Mobile: `grid-cols-1 grid-rows-1`

---

### 3.5 Content Rendering

Render:

- `WorkCard`
- `ExhibitionCard`

Ensure these still support:

- InfoBox
- BG color function

---

## 4. Background Behavior

### 4.1 Remove:

- Noise / grain overlay completely

### 4.2 Add:

- Subtle slow zoom-in animation (CSS transform or Framer Motion)

### 4.3 Apply:

- On BOTH mobile and desktop

---

## 5. Update `InfoBox`

### 5.1 Close Button

- Add button:
  - Position: `absolute top-right`
  - Icon: `cross1Icon`

### 5.2 Close Behavior

On click:

- Hide InfoBox
- Expand WorkImage to 100%

---

### 5.3 Background

- Replace background with:
  - `CornerFrame` component

---

### 5.4 Conditional Visibility

- If BG-color-function is active:
  - Hide `CornerFrame`

---

### 5.5 Typography Rule

- ALL titles inside InfoBox:
  - MUST use `OGubbeText`

- REMOVE any use of:
  - `WigglyButton` for titles

---

## 6. Title List Layer

### 6.1 State

- Controlled by:
  - `showList` (default: `false`)

---

### 6.2 Rendering

When `showList === true`:

- Render a list of all titles
- Use:
  - filtered + sorted dataset

---

### 6.3 Layout

- Position: top-center
- Layer: BEHIND WorkCards (z-index control)

---

### 6.4 Styling

- Use `OGubbeText`

States:

- Active:
  - `text-foreground`

- Inactive:
  - `text-muted-foreground`

---

## 7. Update `WigglyButton`

### 7.1 Active State

Apply:

- margin distortion
- rotation effect

---

### 7.2 Inactive State

- Letters aligned to baseline
- No distortion

---

### 7.3 Hover State

- Trigger same animation as active:
  - margin + rotation

---

## 8. Update `FilterBox`

### 8.1 Buttons

- Replace ALL buttons with:
  - `WigglyButton`

---

### 8.2 Mobile Behavior

- On any button click:
  - Close FilterBox

---

### 8.3 Visibility Rule

- Hide `open-filter-button` when:
  - `menuOverlay === true`

---

### 8.4 Add Blur Text Toggle

Create function:

- Toggles blur on ALL text content

---

#### Behavior:

- Blur:
  - Entire site text

- EXCEPT:
  - `WigglyButton`

---

#### Implementation:

- Reuse logic from:
  - `HeroText` → `WordAnimation-blur`

---

## 9. Mobile Navigation Overlay

### 9.1 Typography

- ALL nav links:
  - Use `OGubbeText`

- DO NOT use `WigglyButton`

- Keep styling unchanged

---

### 9.2 Replace “elinor silow” Link

- Convert into button

---

### 9.3 Behavior

On click:

- Open `HeroText` as overlay

---

### 9.4 Overlay

- Add close button:
  - top-right
  - `cross1Icon`

---

## 10. Info Page

### 10.1 Section Headers

Replace ALL section headers with:

- `OGubbeText`

Examples:

- Solo exhibitions
- Group exhibitions

---

## 11. Search Overlay

### 11.1 Interaction

- Clicking Search:
  - Opens full-width overlay

---

### 11.2 Layout

- Top:
  - Search input

- Below:
  - Query results

---

## 12. WorkModal

- Change button label:
  - `"back"` → `"close"`

---

## 13. SEO Safeguard

### 13.1 Goal

- Preserve current Google result appearance

---

### 13.2 If SEO drops:

Add:

- `bio_short` text

As:

- `sr-only` (screen-reader-only)

Ensure:

- It exists in DOM for indexing

---

## 14. Rules & Constraints

- Do NOT break:
  - existing animations
  - data fetching
  - routing

- Reuse:
  - existing components whenever possible

- Keep:
  - Tailwind conventions
  - Framer Motion patterns

---

## 15. Deliverables

You must:

1. Create:
   - `PageHeader`
   - `DynamicGrid`

2. Refactor:
   - `DesktopNav`
   - `FilterBox`
   - `InfoBox`
   - `WigglyButton`
   - `WorkModal`
   - Mobile Nav Overlay

3. Ensure:
   - Mobile + Desktop parity
   - Clean component structure
   - No duplicated logic

---

If something is unclear:

- Make a reasonable assumption
- Prefer consistency with existing patterns in the codebase
