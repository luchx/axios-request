import dts from "rollup-plugin-dts";
import pluginsConfig from "./scripts/plugins.config.mjs";
import pkg from "./scripts/load-package.cjs";

const createBanner = () => {
  return `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} Echi
  * @license MIT
  */`;
};

// es-bundle
const esBundleConfig = {
  plugins: pluginsConfig("esm"),
  output: {
    banner: createBanner(),
    file: pkg.module,
    format: "esm",
  },
};

// cjs
const cjsConfig = {
  plugins: pluginsConfig("cjs"),
  output: {
    banner: createBanner(),
    file: pkg.main,
    format: "cjs",
    exports: "named",
    name: "_yfRequest_",
    globals: {
      axios: "axios",
      qs: "qs"
    },
  },
};

// global
const globalConfig = {
  plugins: pluginsConfig("iife"),
  output: {
    banner: createBanner(),
    file: pkg.unpkg,
    format: "iife",
    exports: "named",
    name: "_yfRequest_",
    globals: {
      axios: "axios",
      qs: "qs"
    },
  },
};

// typings
const typesConfig = {
  output: {
    file: pkg.types,
    format: "esm",
  },
  plugins: [dts({ respectExternal: true })],
};

const prodFormatConfigs = [
  esBundleConfig,
  cjsConfig,
  globalConfig,
  typesConfig,
];

function buildConfig() {
  return prodFormatConfigs.map((formatConfig) => {
    return Object.assign(
      {
        input: "./lib/index.ts",
      },
      formatConfig
    );
  });
}

export default buildConfig();
