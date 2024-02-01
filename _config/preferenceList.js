const preferences = require("../src/_data/preferences.json");
const opinions = require("../src/_data/opinions.json");

module.exports = function(eleventyConfig) {
	const slugify = eleventyConfig.getFilter("slugify");

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

	const preference = (content, prefId, opinionList) => {
		const pref = preferences[prefId];
		if (!pref) return "ERROR!";
		const ops = opinionList.map(opin => opinions[opin] || null);

		return `
		<section id="pref-${slugify(pref.name)}" class="collapsible collapsible-preference" aria-expanded="false">
			<header>
				<button class="collapsible-button">${pref.name}</button>
			</header>
			<main class="collapsible-content">
				<section class="pref-opinions">${ops.map(op => `<div class="opinion">${op}</div>`).join("")}</section>
				<section class="pref-definition"><p><b>Definition:</b> ${pref.definition}</p></section>
				<section class="pref-opinion-description"><p><b>Opinion:</b></p> ${this.markdownEngine.render(content)}</section>
			</main>
		</section>
		`;
	};

	eleventyConfig.addPairedShortcode("preferenceList", preferenceList);
	eleventyConfig.addPairedShortcode("preference", preference);
};