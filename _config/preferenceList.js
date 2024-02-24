const fs = require("fs");
const path = require("path");
const opinions = require("../src/_data/opinions.json");
const preferences = {};

module.exports = function (eleventyConfig) {
	const slugify = eleventyConfig.getFilter("slugify");

	initializePreferences();

	const collapsible = (content, title, open) => {
		return `
			<section class="collapsible" aria-expanded="${open && "true" || "false"}">
				<header>
					<button class="collapsible-button">${title}</button>
				</header>
				<main class="collapsible-content">
					${this.markdownEngine.render(content)}
				</main>
			</section>
		`;
	};

	const preferenceList = (content, title, open) => {
		return `
			<section id="list-${slugify(title)}" class="collapsible collapsible-list" aria-expanded="${open && "true" || "false"}">
				<header>
					<button class="collapsible-button"><h3>${title}</h3></button>
				</header>
				<main class="collapsible-content">
					${content}
				</main>
			</section>
		`;
	};

	const readSVGFile = filePath => {
		try {
			const svgContent = fs.readFileSync(filePath, 'utf8');
			return svgContent;
		} catch (err) {
			console.error("Error reading SVG file:", err);
			return null;
		}
	};

	const preference = (content, prefId, opinionList) => {
		const pref = getPreference(prefId);
		if (!pref) return "ERROR!";

		const ops = opinionList.map(opin => opinions[opin] || null);
		const symbol = op => `
			<div class="opinion-symbol opinion-${op.classSuffix}" tabindex="0" data-tooltip-text="${op.name}">
				${readSVGFile("src/_includes/icons/" + op.symbol + ".svg")}
			</div>`;
		const symbols = ops.map(op => symbol(op)).join(" ");
		const opins = ops.map(op => `
			<div class="opinion">
				<b>${symbol(op)} ${op.name}:</b> ${op.text}
			</div>`).join("");

		return `
		<section id="pref-${slugify(pref.name)}" class="collapsible collapsible-preference" data-collapsible-type="preference" aria-expanded="false">
			<header>
				<button class="collapsible-button">
					<div class="c-button-name" tabindex="0">${pref.name}</div>
					<div class="c-button-icons">${symbols && `${symbols}` || ""}</div>
				</button>
			</header>
			<main class="collapsible-content">
				<section class="pref-opinions">${opins}</section>
				<section class="pref-definition"><p><b>Definition:</b> ${pref.definition}</p></section>
				<section class="pref-opinion-description"><p><b>Opinion:</b></p> ${this.markdownEngine.render(content)}</section>
			</main>
		</section>
		`;
	};

	eleventyConfig.addPairedShortcode("preferenceList", preferenceList);
	eleventyConfig.addPairedShortcode("preference", preference);
	eleventyConfig.addPairedShortcode("collapsible", collapsible);
};

const initializePreferences = () => {
	const directory = "./src/_data/preferences/";
	const files = fs.readdirSync(directory);
	files.forEach(file => {
		if (file.endsWith('.json')) {
			const filePath = path.join(directory, file);
			const data = fs.readFileSync(filePath, 'utf8');
			const json = JSON.parse(data);
			const filename = path.basename(file, '.json');
			preferences[filename] = json;
		}
	});
};

const getPreference = (preferenceString) => {
	const [filename, key] = preferenceString.split(':');
	if (preferences[filename] && preferences[filename][key]) {
		return preferences[filename][key];
	} else {
		return null;
	}
};
