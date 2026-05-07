import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./index";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "24tdn6fv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  title: "Donna Upcycles It",
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Site Settings").child(
              S.document().schemaType("siteSettings").documentId("siteSettings")
            ),
            S.divider(),
            S.documentTypeListItem("product").title("Products"),
            S.documentTypeListItem("journalPost").title("Journal Posts"),
          ]),
    }),
    visionTool(),
  ],
  basePath: "/studio",
});
