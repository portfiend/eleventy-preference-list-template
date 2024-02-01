const fs = require("fs");
const faviconPlugin = require("eleventy-favicon");
const eleventySass = require("@grimlink/eleventy-plugin-sass");
const sass = require("sass");

module.exports = function (eleventyConfig) {
	this.returnOptions = {
		dir: {
			input: "src",
			output: "build",
			data: "_data"
		}
	};

	eleventyConfig.addPlugin(faviconPlugin, { destination: "build" });
	eleventyConfig.addPlugin(eleventySass, { sass, outputPath: null });

	eleventyConfig.addPassthroughCopy("./src/assets/");
	eleventyConfig.addWatchTarget("./src/assets/");

	return this.returnOptions;
};

