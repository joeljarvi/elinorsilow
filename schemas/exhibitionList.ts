import { defineField, defineType } from "sanity";

export default defineType({
  name: "exhibition_list",
  title: "Exhibition (Archive)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "exhibition_type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Solo Exhibition", value: "Solo Exhibition" },
          { title: "Group Exhibition", value: "Group Exhibition" },
        ],
      },
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
  },
});
