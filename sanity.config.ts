import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Elinor Silow",
  basePath: "/studio",
  projectId: "nk8tddh2",
  dataset: "production",
  plugins: [
    structureTool({
      // Works: a drag-and-drop list (the order shown on the site); the
      // other types as usual.
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            orderableDocumentListDeskItem({
              type: "work",
              title: "Works",
              S,
              context,
            }),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "work",
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
