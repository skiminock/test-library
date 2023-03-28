const esbuild = require("esbuild");
const {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} = require("fs");
const { join } = require("path");

const dist = join(process.cwd(), "dist");

if (!existsSync(dist)) {
  mkdirSync(dist);
}

const entryPoints = []

function parseEntryPoints(folder) {
  readdirSync(join(process.cwd(), folder))
  .forEach(
    (file) => {
      if (statSync(join(process.cwd(), folder, file)).isFile()) {
        entryPoints.push(`${folder}/${file}`)
      } else {
        parseEntryPoints(`${folder}/${file}`)
      }
    }
  )
}

parseEntryPoints('src')

console.log('entryPoints', entryPoints)

// esm output bundles with code splitting
esbuild
  .build({
    entryPoints,
    outdir: "dist/esm",
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    define: { global: "window" },
    target: ["esnext"],
  })
  .catch(() => {
    console.log('azaza')
    return process.exit(1)
  });

// cjs output bundle
esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/cjs/index.cjs.js",
    bundle: true,
    sourcemap: true,
    minify: true,
    platform: "node",
    target: ["node16"],
  })
  .catch(() => process.exit(1));

// an entry file for cjs at the root of the bundle
writeFileSync(join(dist, "index.js"), "export * from './esm/index.js';");

// an entry file for esm at the root of the bundle
writeFileSync(
  join(dist, "index.cjs.js"),
  "module.exports = require('./cjs/index.cjs.js');"
);


// const { build } = require("esbuild");
// const { dependencies } = require("./package.json");

// const entryFile = "src/index.ts";
// const shared = {
//   bundle: true,
//   entryPoints: [entryFile],
//   // Treat all dependencies in package.json as externals to keep bundle size to a minimum
//   external: Object.keys(dependencies),
//   logLevel: "info",
//   minify: true,
//   sourcemap: true,
// };

// build({
//   ...shared,
//   format: "esm",
//   outfile: "./dist/index.esm.js",
//   target: ["esnext", "node12.22.0"],
// });

// build({
//   ...shared,
//   format: "cjs",
//   outfile: "./dist/index.cjs.js",
//   target: ["esnext", "node12.22.0"],
// });