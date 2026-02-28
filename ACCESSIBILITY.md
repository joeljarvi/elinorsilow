# Accessibility Audit Specification

## Goal

Review the codebase and improve accessibility.

Focus on improving usability for:

- Screen readers
- Keyboard users
- Low-vision users

The goal is to improve accessibility **without changing the visual design or layout.**

This is an incremental process. Improvements should be small and safe.

---

## Scope

Review:

- React components
- Navigation
- Modals
- Carousels
- Buttons
- Links
- Images
- Forms (if present)

Focus on real usability improvements.

---

## Out of Scope

Do NOT:

- Redesign the UI
- Change layout
- Change animations
- Rewrite architecture
- Replace libraries
- Introduce large refactors

Prefer small targeted fixes.

---

## Accessibility Standards

Follow:

- WCAG 2.1 AA where practical

Focus especially on:

### Semantic HTML

Prefer:

- `<button>` instead of clickable `<div>`
- `<nav>` for navigation
- `<main>` for main content
- `<header>` and `<footer>`
- Proper heading structure

Avoid:

- Non-semantic interactive elements

---

### ARIA Usage

Add ARIA only when necessary.

Common attributes:

- aria-label
- aria-hidden
- aria-expanded
- aria-controls
- aria-current
- aria-live

Avoid unnecessary ARIA.

Use semantic HTML first.

---

### Images

All images must have:

- alt attributes

Rules:

- Decorative images → alt=""
- Content images → descriptive alt text

Avoid:

- Missing alt attributes

---

### Keyboard Navigation

Ensure:

- All interactive elements are keyboard accessible
- Tab order is logical
- Buttons are reachable
- Links are reachable

Check:

- Tab navigation
- Enter key
- Space key

---

### Focus Management

Check:

- Visible focus states
- Logical focus order

Important areas:

- Modals
- Menus
- Navigation

Ensure:

- Focus moves into modals
- Focus returns when modal closes

---

### Modals

Ensure modals:

- Trap focus
- Close with Escape
- Have aria-modal="true"
- Have role="dialog"
- Have labels

Example:

role="dialog"
aria-modal="true"
aria-labelledby="modal-title"

---

### Carousels

Ensure carousels:

- Are keyboard navigable
- Have accessible buttons
- Have labels

Example:

aria-label="Next image"
aria-label="Previous image"

Avoid:

- Autoplay without pause
- Invisible controls

---

## Project Rules

Follow CLAUDE.md rules:

- Use shadcn/ui components when possible
- Use TailwindCSS for styling
- Prefer modifying existing components
- Keep components simple

Do not introduce new UI systems.

---

## Priority Areas

Focus especially on:

1. Navigation
2. Modals
3. Carousels
4. Mobile navigation
5. Image galleries

Work one area at a time.

---

## Required Improvements

Look for:

- Missing aria-label attributes
- Clickable divs
- Missing alt attributes
- Incorrect heading structure
- Missing roles
- Missing labels
- Broken keyboard navigation
- Missing focus states
- Focus traps
- Hidden interactive elements

---

## Strategy

Work incrementally.

Do not attempt to fix the entire project at once.

Start with:

1. Navigation
2. Modals
3. Carousels

After that:

4. Pages
5. Components

Prefer small safe improvements.

---

## Output Format

For each issue use this format:

### File

/path/to/file.tsx

### Problem

Short description of the issue.

### Why it matters

Explain the accessibility problem.

### Fix

Provide a concrete code suggestion.

Example:

### File

components/Nav.tsx

### Problem

Clickable div used as button.

### Why it matters

Screen readers cannot detect it as interactive.

### Fix

Replace:

<div onClick={toggleMenu}> ```

With:

<button
onClick={toggleMenu}
aria-label="Toggle menu"
aria-expanded={open}

>

A component is considered improved when:

It works with keyboard navigation

It works with screen readers

It uses semantic HTML

It has proper labels

It has proper alt text

---
