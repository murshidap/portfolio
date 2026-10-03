// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import { fileURLToPath } from "node:url";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  // The Vercel proxy rewrites the SSR request host before Astro evaluates its
  // built-in origin check. Admin mutations use isSameOriginAdminRequest()
  // instead, which compares the browser Origin with Vercel's forwarded host.
  security: {
    checkOrigin: false
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  }
});
