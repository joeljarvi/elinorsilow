// The view-transition name shared by a work's / exhibition's image in the
// feed (or grid) and on its own page, so navigating between them morphs one
// into the other (zooming in, and out on the way back). Built from the
// page's href, as a valid CSS identifier.
export function vtName(href: string) {
  return (
    "vt" +
    href.replace(/[^a-zA-Z0-9-]/g, (c) => "_" + c.charCodeAt(0).toString(36))
  );
}
