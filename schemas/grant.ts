import { defineField, defineType } from "sanity";

export default defineType({
  name: "grant",
  title: "Grant / Award",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      description: "Who awarded it (shown after the title on /info).",
    }),
    defineField({ name: "year", title: "Year", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
  },
});
