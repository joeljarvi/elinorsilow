You are working inside an existing Next.js (App Router) project using React, TailwindCSS, and Framer Motion.

Your task is to implement a series of UI/UX improvements across multiple components. Execute this step-by-step. Do not skip steps. After each major step, verify correctness before proceeding.

---

# STEP 0 — DISCOVER STRUCTURE

1. Locate the following components (or closest equivalents):
   - ExhibitionsPage
   - ExhibitionCard
   - ExhibitionModal
   - ExhibitionSlugModalClient
   - InfoBox
   - WorksPage
   - HomePage
   - PageHeader
   - ProportionalWorkImage
   - Loader / PageLoader
   - ColorMode / colorBG
   - InfoPageClient
   - CookieAccept component
   - NavOverlay (mobile + desktop)
   - WigglyButton

2. Map how:
   - InfoBox is triggered on Works/Home
   - Work modals are opened
   - Navigation overlays are structured

Do not implement yet. Only understand structure.

---

# STEP 1 — EXHIBITIONS PAGE IMAGE SIZING

Update Exhibition images:

- Desktop: `max-h-[75vh]`
- Mobile: `max-h-[50vh]`

Ensure:

- Images maintain aspect ratio
- No overflow issues

---

# STEP 2 — EXHIBITION CARD → INFOBOX FLOW

Change interaction pattern:

1. Clicking an ExhibitionCard should:
   - NOT open modal
   - Instead reveal InfoBox (reuse Works/Home logic)

2. Reuse existing InfoBox state logic if possible

3. Ensure only one InfoBox is active at a time

---

# STEP 3 — INFOBOX CONTENT FOR EXHIBITIONS

Populate InfoBox with:

- title
- year
- type → append `" exhibition"`
- venue/location
- city
- featured works (list)
- credits

Source data from:
→ ExhibitionSlugModalClient

Match styling from existing InfoBox (Works/Home)

---

# STEP 4 — IMAGE CLICK → MODAL

Inside the revealed InfoBox:

- Clicking the Exhibition image should:
  → Open ExhibitionModal

---

# STEP 5 — EXHIBITION MODAL REFACTOR

Modify ExhibitionModal:

1. Only render:
   - Lightbox/gallery

2. Add overlay UI:

   METADATA OVERLAY:
   - Desktop: bottom-center (absolute)
   - Mobile: top-center (absolute)

   CONTROLS:
   - Desktop: top-right
     - Back
     - Prev
     - Next

   - Mobile: bottom-center
     - Back
     - Prev
     - Next

Ensure:

- Proper z-index layering
- No layout shift during transitions

---

# STEP 6 — INFOBOX ANIMATION

Apply to:

- WorksPage
- HomePage
- ExhibitionsPage

Add Framer Motion animation:

- Initial: blurred + low opacity
- Animate to: sharp + full opacity

Use:

- blur filter
- opacity
- smooth easing (not snappy)

---

# STEP 7 — PAGE HEADER

## Breadcrumb

1. Reintroduce breadcrumb
2. Format:
   - "works" for WorksPage/HomePage
   - Use "/" as separator
   - Each "/" must be its own <span>

## Work Title Behavior

- Desktop:
  - Show hoverTitle only

- Mobile:
  - Show in-view title only

## Exhibitions title:

- Leave unchanged

---

# STEP 8 — WORK CARD VERTICAL ALIGNMENT

Goal:

- Visually center WorkCards more vertically

If using `object-top` in ProportionalWorkImage:

- Add top margin to compensate

Avoid breaking layout or scroll flow

---

# STEP 9 — LOADER CONSISTENCY

- Match text size exactly with:
  OGubbbeText used in UnderConstruction overlay

Ensure:

- Same font size
- Same visual weight

---

# STEP 10 — COLOR MODE FIXES

## Background Layering

Fix:

- colorBG must render BEHIND all content

Ensure:

- Correct stacking context
- No overlap with cards

## Blend Mode

Apply `mix-blend-difference` to:

- Nav
- Filters
- Buttons

Goal:

- Maintain readability in Color Mode

---

# STEP 11 — INFOPAGE MOBILE LAYOUT

In InfoPageClient:

- On mobile:
  - full width
  - flex
  - flex-col

Ensure no horizontal padding conflicts

---

# STEP 12 — COOKIE ACCEPT OVERLAY

- Add:
  - `p-[9px]`

---

# STEP 13 — MOBILE NAV OVERLAY ANIMATION

Target:

- Vertical WigglyButtons

Add Framer Motion animation:

- Animate layout from:
  - `justify-start`
    → `justify-between`

- Long duration

- Smooth easing

Desired feel:

- Elements slowly “fall downward”

---

# STEP 14 — REMOVE LEGACY NAV OVERLAY

Remove:

- Old desktop nav overlay
- The version with large vertical OGubbeText

Clean up:

- Unused components
- Dead styles

---

# STEP 15 — DESKTOP NAV OVERLAY UPDATE

In horizontal nav overlay:

- Add button:
  - Label: "instagram"
  - Use WigglyButton component

Ensure:

- Matches existing styling + spacing

---

# FINAL CHECK

Before finishing:

1. Test:
   - Mobile vs Desktop behavior
   - InfoBox interactions
   - Modal flows
   - Navigation overlays

2. Verify:
   - No z-index issues
   - No hydration errors
   - Animations are smooth and consistent

3. Refactor:
   - Reuse existing logic where possible
   - Avoid duplication

---

Proceed step-by-step. Do not batch changes. Validate each step before continuing.
