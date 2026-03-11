import { build } from "esbuild";

await build({
  entryPoints: ["src/typescript/lambdas/*.ts"],
  bundle: true,
  sourcemap: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outdir: "target/typescript",
});
