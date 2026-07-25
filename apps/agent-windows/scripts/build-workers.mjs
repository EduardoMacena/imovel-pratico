import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const agentWindowsRoot = resolve(__dirname, "..");
const monorepoRoot = resolve(agentWindowsRoot, "../..");
const outRoot = resolve(agentWindowsRoot, "dist/workers");

await rm(outRoot, {
  recursive: true,
  force: true
});

const commonOptions = {
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  sourcemap: false,
  minify: false,
  logLevel: "info",
  external: ["playwright"]
};

await build({
  ...commonOptions,
  entryPoints: [
    resolve(monorepoRoot, "apps/worker-registro/src/agent.ts")
  ],
  outfile: resolve(outRoot, "worker-registro/agent.cjs")
});

await build({
  ...commonOptions,
  entryPoints: [
    resolve(monorepoRoot, "apps/worker-cnd/src/agent.ts")
  ],
  outfile: resolve(outRoot, "worker-cnd/agent.cjs")
});

console.log("Workers empacotados em dist/workers.");