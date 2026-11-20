import { defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "work",
  title: "Work",
  type: "document",
  // Ordered by dragging in the Works list (orderRank).
  orderings: [orderRankOrdering],
  fields: [
    // The position set by dragging; new works go to the top.
    orderRankField({ type: "work", newItemPosition: "before" }),
    defineField({
      name: "hidden",
      title: "Hide from site",
      description:
        "Hidden works stay here in the CMS but don't show anywhere on the site.",
      type: "boolean",
      initialValue: false,
    }),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Painting", value: "painting" },
          { title: "Drawing", value: "drawing" },
          { title: "Sculpture", value: "sculpture" },
          { title: "Textile", value: "textile" },
        ],
      },
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "string",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
    }),
    defineField({
      name: "exhibition",
      title: "Exhibition",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Sold", value: "sold" },
          { title: "On view", value: "on view" },
          { title: "Available", value: "available" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured on home page",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", media: "image", year: "year", hidden: "hidden" },
    // "Hidden" next to the year in the Studio's lists.
    prepare: ({ title, media, year, hidden }) => ({
      title,
      media,
      subtitle: [year, hidden && "Hidden"].filter(Boolean).join(" · "),
    }),
  },
});
