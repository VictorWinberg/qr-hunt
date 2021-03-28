import { babel } from "@rollup/plugin-babel";
import { default as html, makeHtmlAttributes } from "@rollup/plugin-html";
import { generateSW } from "rollup-plugin-workbox";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import dev from "rollup-plugin-dev";
import copy from "rollup-plugin-copy";

const htmlTemplate = (vars) => `<!doctype html>
<html ${makeHtmlAttributes(vars.attributes.html)}>
	<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="//use.fontawesome.com/releases/v5.15.2/css/all.css">
		<title>${vars.title}</title>
		${vars.files.js.map((f) => `<script ${makeHtmlAttributes(vars.attributes.script)} src="${vars.publicPath + f.fileName}"></script>`)}
	</head>
	<body>
    <noscript>
      <strong>
        We're sorry but this site doesn't work properly without JavaScript
        enabled. Please enable it to continue.
      </strong>
    </noscript>
		<div id="app" />
	</body>
</html>`;

const PROD = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: PROD ? "[name]-[hash].js" : "[name].js",
  },
  plugins: [
    PROD && del({ targets: "dist/*" }),
    resolve(),
    babel({
      babelHelpers: "bundled",
      plugins: [
        ["babel-plugin-transform-react-jsx", { pragma: "jsx" }],
        ["babel-plugin-jsx-pragmatic", { module: "hyperapp-jsx-pragma", import: "jsx" }],
      ],
    }),
    postcss({
      plugins: [],
      minimize: true,
    }),
    PROD && terser(),
    injectProcessEnv({
      NODE_ENV: PROD ? "production" : "development",
    }),
    html({
      title: "Hyperapp + JSX + Rollup Starter Demo",
      publicPath: "./",
      template: htmlTemplate,
    }),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist/' },
      ]
    }),
    PROD && generateSW({
      swDest: "dist/sw.js",
      globDirectory: "dist/",
    }),
    !PROD &&
      dev({
        dirs: ['dist'],
        port: 8080,
        spa: 'dist/index.html',
        proxy: { '/api/*': 'http://localhost:3000/' },
      }),
    !PROD && livereload(),
  ],
};
