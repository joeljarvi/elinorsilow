import { defineField, defineType } from "sanity";

export default defineType({
  name: "grant",
  title: "Grant / Award",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "year", title: "Year", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
  },
});
