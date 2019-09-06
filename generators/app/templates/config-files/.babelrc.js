module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          ie: "11"
        },
        useBuiltIns: "entry"
      }
    ],
    "next/babel",
    "@zeit/next-typescript/babel"
  ],
  plugins: []
};
