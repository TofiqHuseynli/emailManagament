module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier",
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "simple-import-sort", "import", "prettier"],
  rules: {
    "react/display-name": [0, { ignoreTranspilerName: true }],
    "react/prop-types": 0,
    "no-unused-vars": 1,
    "no-console": "error",
    "simple-import-sort/sort": "error",
    "import/newline-after-import": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
