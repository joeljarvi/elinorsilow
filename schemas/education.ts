import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "school", title: "School", type: "string" }),
    defineField({ name: "start_year", title: "Start Year", type: "number" }),
    defineField({ name: "end_year", title: "End Year", type: "number" }),
    defineField({ name: "city", title: "City", type: "string" }),
  ],
  preview: {
    select: { title: "school", subtitle: "start_year" },
  },
});
