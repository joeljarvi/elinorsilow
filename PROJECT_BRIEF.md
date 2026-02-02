# Artist Website – UI/UX Refactor & Interaction Improvements

## Goal

Help analyze, refine, and complete this artist’s website.
The overall visual layout is already good.  
The focus is on **interaction, navigation flow, consistency, accessibility, and performance.**

Do NOT redesign from scratch.  
Iterate and improve what already exists.

---

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Embla Carousel
- Context API:
  - WorksContext
  - ExhibitionsContext
  - NavContext
  - InfoContext

---

## Primary Problems to Solve

### 1. Menu / Navigation Transitions

The menu/nav looks good visually, but the **open/close transitions between view modes are abrupt.**

#### Requirements

- Add smoother animated transitions when switching between:
  - Works
  - Exhibitions
  - Information
- On **mobile**, the menu/nav MUST:
  - Close when clicking:
    - "Works"
    - "Exhibitions"
    - "Information"

---

### 2. Replace Styled Buttons & Filters with shadcn

The buttons and select filters inside the menu/nav are:

- Over-styled
- Inconsistent in spacing
- Visually noisy

#### Requirements

- Replace all custom styled buttons with **shadcn components**
- Replace select/filter dropdowns with **shadcn Select**
- Ensure consistent padding, spacing, and alignment across the nav

---

### 3. Filter Flow UX

Using filters currently feels unfinished.

#### Requirements

Inside the menu/nav:

- Add **Apply Filters** button
- Add **Clear Filters** button

#### Behavior

- Apply Filters:
  - Applies filters
  - Closes the menu/nav on mobile
  - Shows a loader that says:
    > **Applying filters…**
- Loader styling should match the **Work-info description style**

- Clear Filters:
  - Resets all filters
  - Closes the menu/nav on mobile

---

### 4. Works Modal Interaction

When clicking a work:

#### Requirements

- Modal opens with:
  - Carousel at the top
- Desktop:
  - Arrow keys navigate:
    - Next work
    - Previous work
  - Navigation must use `filteredWorks`
- Mobile:
  - Swipe gestures to move between works

---

### 5. Exhibitions Modal Interaction

When clicking an exhibition:

#### Requirements

- Modal opens
- Layout:
  - Mobile: **centered**
  - Desktop: **left aligned**
- Desktop:
  - Arrow keys navigate between `filteredExhibitions`
- Mobile:
  - Swipe navigation

---

### 6. Information View Styling (Lined Paper Look)

The Information view should feel like **lined paper**.

#### Divider Rules

Use:

- `HDivider`
- `VDivider`

But:

- Only on lists and structured blocks
- Not everywhere

#### Bonus

- If a divider contains a **Link**, make it **blue**

---

### 7. Back To Top Buttons

Add **Back to Top** buttons at:

- Bottom of `MainContent`
- Bottom of `ExhibitionModal`

---

### 8. Typography Refactor

All inline text styling must be removed.

Create global CSS utility classes:

- `.h1`
- `.h2`
- `.h3`
- `.p`
- `.small`
- etc.

Then refactor:

- All headings
- All paragraphs
- All modal text
  To use these classes only.

---

### 9. Performance

Loading feels slow.

#### Investigate

- Context re-renders
- Image loading
- Carousels
- Animations
- Modals

#### Goal

Improve perceived performance and responsiveness.

---

## Non-Goals

- Do not change the site’s identity or art direction
- Do not remove Framer Motion or Embla
- Do not replace Context API

---

## Output Expectations

- Clean component refactors
- Minimal visual changes
- Better UX flow
- Consistent nav
- Keyboard + mobile accessibility
- Improved perceived performance
