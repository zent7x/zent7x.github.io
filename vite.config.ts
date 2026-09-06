import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Applied to production builds only: the dev server needs inline scripts for HMR.
// GitHub Pages cannot send headers, so the policy ships as a meta tag.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

export default defineConfig({
  // Pull request previews are served from a subpath of the same Pages site.
  base: process.env.BASE_PATH || "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "csp-meta",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        );
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
});
