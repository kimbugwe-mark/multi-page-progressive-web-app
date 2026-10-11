import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "src/backend/index.ts",
    tsconfig: "./tsconfig.node.json",
    name: "node",
    platform: "node",
    format: "esm",
    target: "node18",
    dts: {
      tsgo: true,
    },
    exports: true,
    clean: false,
    sourcemap: true,
    copy: "src/public",
    // ...config options
  },
  {
    entry: "src/frontend/serviceworker/serviceworker.ts",
    tsconfig: "./tsconfig.browser.json",
    platform: "browser",
    target: "es2022",
    name: "serviceworker",
    minify: true,
    clean: true,
    sourcemap: true,
    outDir: "dist/public",
    deps: {
      alwaysBundle: ['hono','achi-html-stream','@hono/service-worker'], 
    },
    dts: {
      tsgo: true,
    },
  },
  {
    entry: "src/frontend/page/index.ts",
    tsconfig: "./tsconfig.browser.json",
    platform: "browser",
    target: "es2022",
    name: "page",
    minify: false,
    clean: false,
    sourcemap: true,
    outDir: "dist/public/js",
    outputOptions: {
      entryFileNames: "[name].js",
    },
    dts: {
      tsgo: true,
    },
  },
]);
