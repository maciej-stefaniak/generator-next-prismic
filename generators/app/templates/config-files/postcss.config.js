const autoprefixer = require("autoprefixer");
const clean = require("postcss-clean");
const removeDuplicates = require("postcss-discard-duplicates");

module.exports = {
  plugins: [autoprefixer, clean, removeDuplicates]
};
