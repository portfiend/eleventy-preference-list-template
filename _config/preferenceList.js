const preferences = require("../src/_data/preferences.json");
const opinions = require("../src/_data/opinions.json");

module.exports = function (eleventyConfig) {
	const slugify = eleventyConfig.getFilter("slugify");

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

	const preference = (content, prefId, opinionList) => {
		const pref = preferences[prefId];
		if (!pref) return "ERROR!";

		const ops = opinionList.map(opin => opinions[opin] || null);
		const symbol = op => `<div class="opinion-symbol" title="${op.name}" style="color:${op.color}">${op.symbol}</div>`;
		const symbols = ops.map(op => symbol(op)).join(", ");
		const opins = ops.map(op => `<div class="opinion"><b>[${symbol(op)}] ${op.name}:</b> ${op.text}</div>`).join("");

		return `
		<section id="pref-${slugify(pref.name)}" class="collapsible collapsible-preference" aria-expanded="false">
			<header>
				<button class="collapsible-button">${pref.name} ${symbols && `(${symbols})` || ""}</button>
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