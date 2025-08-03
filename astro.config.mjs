// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://solaris.software",
  trailingSlash: "always",
  integrations: [tailwind(), svelte(), sitemap()],
  prefetch: {
    defaultStrategy: "hover",
  },
  build: {
    // Enable inlining of critical CSS
    inlineStylesheets: "auto"
  },
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Reduce chunk size warning threshold
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Optimize chunk sizing
          manualChunks(id) {
            // Separate GSAP into its own chunk to be loaded dynamically
            if (id.includes('gsap')) {
              return 'gsap-animations';
            }
            // Group dev tools separately 
            if (id.includes('astro') && id.includes('dev-toolbar')) {
              return 'dev-toolbar';
            }
            // Vendor libs in separate chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    ssr: {
      // Reduce SSR bundle size
      noExternal: ['gsap']
    }
  },
  devToolbar: {
    // Reduce dev toolbar overhead
    enabled: process.env.NODE_ENV === 'development'
  },
});