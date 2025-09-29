import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

let devTagger: any = null;
try {
  devTagger = require("lovable-tagger").componentTagger;
} catch {}

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/tagmax-onboard-buddy/" : "/",
  server: { host: "::", port: 8080 },
  plugins: [react(), mode === "development" && devTagger && devTagger()].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
