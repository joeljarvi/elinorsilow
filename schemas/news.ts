import { defineField, defineType } from "sanity";

// One entry on the home page: date, exhibition/event name (optionally
// linked) and location.
const newsItem = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "date", title: "Date", type: "date" }),
      defineField({ name: "name", title: "Name", type: "string" }),
      defineField({
        name: "link",
        title: "Link",
        type: "url",
        description: "Full URL (https://…) or a site path like /exhibitions/…",
        validation: (Rule) =>
          Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
      }),
      defineField({ name: "location", title: "Location", type: "string" }),
    ],
  });

export default defineType({
  name: "news",
  title: "News",
  type: "document",
  fields: [
    newsItem("current", "Current"),
    newsItem("upcoming", "Upcoming"),
    newsItem("past", "Past"),
  ],
  preview: {
    prepare: () => ({ title: "News" }),
  },
});
