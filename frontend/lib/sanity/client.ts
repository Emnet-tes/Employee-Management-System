import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "rkkcgp3r",
  dataset: "production",
  apiVersion: "2025-12-06",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Ensure this is set in your environment variables
});
