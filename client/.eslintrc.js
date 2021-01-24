module.exports = {
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:vue/recommended",
    "@vue/standard",
    "@vue/typescript",
    "@vue/prettier"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  // overrides: [
  //   {
  //     files: [
  //       "**/__tests__/*.{j,t}s?(x)",
  //       "**/tests/unit/**/*.spec.{j,t}s?(x)"
  //     ],
  //     env: {
  //       jest: true
  //     }
  //   }
  // ]
};
