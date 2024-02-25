const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

module.exports = (eleventyConfig) => {
	const convertYamlToJson = (directory) => {
		const preferencesDir = path.join(__dirname, directory);

		fs.readdir(preferencesDir, (err, files) => {
			if (err) {
				console.error('Error reading directory:', err);
				return;
			}

			files.forEach(file => {
				if (path.extname(file) === '.yaml') {
					const yamlFile = fs.readFileSync(path.join(preferencesDir, file), 'utf8');

					try {
						const jsonData = yaml.load(yamlFile);

						const jsonFileName = path.basename(file, '.yaml') + '.json';
						fs.writeFileSync(path.join(preferencesDir, jsonFileName), JSON.stringify(jsonData, null, 2));

						console.log(`Successfully converted ${file} to ${jsonFileName}`);
					} catch (error) {
						console.error(`Error converting ${file} to JSON:`, error);
					}
				}
			});
		});
	};

	eleventyConfig.on('eleventy.after', async () => {
		convertYamlToJson('../build/assets/data/preferences');
  });

	eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
};