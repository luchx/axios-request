import peerDepsExternal from "rollup-plugin-peer-deps-external";
import esbuild from "rollup-plugin-esbuild";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default function (format) {
  return [
    peerDepsExternal(),
    terser({
      module: /^esm/.test(format),
      compress: {
        ecma: 2015,
        pure_getters: true,
      },
    }),
    babel({
      babelHelpers: "bundled",
    }),
    typescript(),
    esbuild()
  ];
}
