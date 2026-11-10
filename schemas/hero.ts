import { defineArrayMember, defineField, defineType } from "sanity";

// The home page's background images: upload new ones or pick works. One is
// shown at random behind the home page.
export default defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Background images",
      type: "array",
      description:
        "Upload images, or pick works (their image is used). One is shown at random on the home page.",
      of: [
        defineArrayMember({
          type: "image",
          title: "Upload image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        }),
        defineArrayMember({
          type: "reference",
          title: "Work",
          to: [{ type: "work" }],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Hero (home page background)" }),
  },
});
