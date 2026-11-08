import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import order from "./sanity/schemas/order";
import service from "./sanity/schemas/service";
import user from "./sanity/schemas/user";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local.",
  );
}

export default defineConfig({
  name: "default",
  title: "Khadamat Maroc",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title("المحتوى").items(S.documentTypeListItems()),
    }),
  ],
  schema: { types: [user, service, order] },
});
