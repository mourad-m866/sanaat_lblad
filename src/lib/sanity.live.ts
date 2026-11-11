import { createClient } from "next-sanity";
import {
  defineLive,
  type StrictDefinedFetchType,
} from "next-sanity/live";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";

if (!projectId || !dataset) {
  console.warn(
    "Sanity environment is not configured; the app will show empty content until NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set.",
  );
}

export const sanityClient = createClient({
  projectId: projectId || "demo",
  dataset: dataset || "production",
  apiVersion: "2026-11-06",
  useCdn: true,
  perspective: "published",
});

const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  browserToken: false,
  serverToken: false,
  strict: true,
});

export const cachedSanityFetch: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};

export { SanityLive };
