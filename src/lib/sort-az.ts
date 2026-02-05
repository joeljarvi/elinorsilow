export const sortAZ = <T extends { title: { rendered: string } }>(items: T[]) =>
  [...items].sort((a, b) =>
    a.title.rendered.localeCompare(b.title.rendered, "sv", {
      sensitivity: "base",
    })
  );
