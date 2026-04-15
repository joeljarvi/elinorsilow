import { defineField, defineType } from "sanity";

export default defineType({
  name: "short_bio",
  title: "Short Bio",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      description: "A brief one-line or short paragraph bio for use in headers and previews.",
    }),
  ],
});
