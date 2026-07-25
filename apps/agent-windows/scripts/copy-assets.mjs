import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

await mkdir(resolve(root, "dist/renderer"), { recursive: true });

await cp(resolve(root, "src/renderer"), resolve(root, "dist/renderer"), {
  recursive: true
});

console.log("Assets do renderer copiados.");
