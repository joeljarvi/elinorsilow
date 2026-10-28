import { defineField, defineType } from "sanity";

export default defineType({
  name: "press",
  title: "Press",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({ name: "year", title: "Year", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
  },
});
