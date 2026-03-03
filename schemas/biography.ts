import { defineField, defineType } from "sanity";

export default defineType({
  name: "biography",
  title: "Biography",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
    }),
  ],
});
