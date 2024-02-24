const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
	const downloadLinks = () => {
		const directory = 'build/assets/data/preferences';
		const linkPath = '/assets/data/preferences';

		const files = fs.readdirSync(directory);
		const jsonFiles = files.filter(file => file.endsWith('.json'));
		const links = jsonFiles.map(file => {
			const filePath = path.join(linkPath, file);
			const fileName = path.basename(file, '.json');
			return `<li><a href="${filePath}" download>${fileName}.json</a></li>`;
		});
		return `<ul>${links.join('')}</ul>`;
	};

	eleventyConfig.addShortcode("downloadLinks", downloadLinks);
};