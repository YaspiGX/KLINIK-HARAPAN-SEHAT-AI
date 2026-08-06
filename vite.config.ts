// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// ... (komentar bawaan biarkan saja) ...
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // BARIS SAKTI: Matikan mode Server-Side (SSR) supaya jadi web statis biasa
    ssr: false, 
    
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
});