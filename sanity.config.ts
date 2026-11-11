import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { SendOrderWhatsAppAction } from "./sanity/actions/send-order-whatsapp";
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
  document: {
    actions: (previousActions, context) =>
      context.schemaType === "order"
        ? [...previousActions, SendOrderWhatsAppAction]
        : previousActions,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("المحتوى")
          .items([
            S.listItem()
              .id("pendingCraftsmen")
              .title("طلبات الحرفيين قيد المراجعة")
              .child(
                S.documentTypeList("user")
                  .title("طلبات الحرفيين قيد المراجعة")
                  .filter('_type == "user" && role == "craftsman" && isVerified == false')
                  .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
              ),
            S.divider(),
            ...S.documentTypeListItems(),
          ]),
    }),
  ],
  schema: { types: [user, service, order] },
});
