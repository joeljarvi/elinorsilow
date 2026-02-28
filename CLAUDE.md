# Project Overview

This project is a portfolio and archive website for Elinor Silow, a Stockholm-based painter and mixed media artist.

The website serves two main purposes:

1. Public portfolio for visitors
2. Long-term archive of artworks and exhibitions

The artist produces a very large volume of work, so the system must scale to hundreds or thousands of artworks over time.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TailwindCSS
- Framer Motion
- Embla Carousel
- - shadcn/ui component library

## Backend

- WordPress (Headless CMS)
- WordPress REST API

Custom Post Types:

- Works
- Exhibitions

---

# Core Requirements

## Works

Each artwork entry includes:

- Title
- Year
- Medium
- Dimensions
- Description
- Multiple images

Requirements:

- Fast browsing
- Image-focused UI
- Smooth navigation
- Modal-based viewing
- Scalable to large collections

---

## Exhibitions

Each exhibition includes:

- Title
- Start date
- End date
- Venue
- City
- Description
- Credits
- Images

Requirements:

- Chronological browsing
- Clear structure
- Easy updates

---

# Pages

Static pages include:

- About / Biography
- CV
- Contact

---

# Design Principles

- Minimal UI
- Artwork-first layout
- Fast loading
- Mobile-first
- Smooth animations

Avoid:

- Visual clutter
- Heavy page builders
- Complex CMS logic in frontend

---

## UI Guidelines

- Use shadcn/ui components whenever possible
- Prefer existing shadcn/ui components over custom components
- Style components using TailwindCSS
- Keep components simple and reusable
- Avoid unnecessary abstraction

---

# Architecture Goals

- WordPress is used only as a CMS and database
- Next.js handles all rendering and UI
- Clean separation between content and presentation
- Maintainable long-term structure

---

# Important Constraints

- The archive will grow continuously
- Performance must remain good with large datasets
- Code should be modular and reusable
- Components should be simple and predictable
