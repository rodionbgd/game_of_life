module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  overrides: [{
    "files": ["src/*.js"],
    rules: {
      "max-len": [
        "error",
        {
          ignoreComments: true,
          code: 120,
        },
      ],
      "no-continue": "off",
    },
  }],

  plugins: ["jest"],
};
