import { defineField, defineType } from "sanity";

export default defineType({
  name: "long_bio",
  title: "Long Bio",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Long Bio",
      type: "text",
      description: "Full biography text displayed on the info page.",
      rows: 10,
    }),
  ],
});
