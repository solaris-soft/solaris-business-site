// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://solaris.software",
  trailingSlash: "always",
  output: "server",
  adapter: cloudflare(),
  integrations: [svelte(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
