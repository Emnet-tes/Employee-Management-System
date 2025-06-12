import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "rkkcgp3r",
  dataset: "production",
  apiVersion: "2025-12-06",
});
