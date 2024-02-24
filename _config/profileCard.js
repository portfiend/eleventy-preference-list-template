module.exports = function (eleventyConfig) {
	function profileCard (content, iconPath, links) {
		let linksList = '<ul class="pcard-links">';
		for (const key in links) {
			linksList += `<li><a href="${links[key]}">${key}</a></li>`;
		}
		linksList += '</ul>';
		console.log(linksList);

		return `
			<article class="profile-card">
			<aside class="pcard-left">
				<img src="/assets/img/${iconPath || "bust.svg"}" class="pcard-icon" alt="Icon for {{pageTitle}}">
				${linksList}
			</aside>
			<main class="pcard-right">
				${content}
			</main>
		</article>
		`;
	}

	eleventyConfig.addPairedShortcode("profileCard", profileCard);
};