import { createClient } from "next-sanity";
import {
  defineLive,
  type StrictDefinedFetchType,
} from "next-sanity/live";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local.",
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
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
