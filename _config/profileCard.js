module.exports = function (eleventyConfig) {
	function profileCard (content, iconPath) {

		return `
			<article class="profile-card">
			<aside class="pcard-left">
				<img src="/assets/img/${iconPath || "bust.svg"}" class="pcard-icon" alt="Icon for {{pageTitle}}">
			</aside>
			<main class="pcard-right">
				${content}
			</main>
		</article>
		`;
	}

	eleventyConfig.addPairedShortcode("profileCard", profileCard);
};