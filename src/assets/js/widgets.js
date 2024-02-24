const tabs = {};

document.addEventListener("DOMContentLoaded", () => {
	initTabLists();
	initCollapsibleLists();
	initTooltip();
});

const initTooltip = () => {
	const opinionSymbols = document.querySelectorAll('.opinion-symbol');
	const tooltip = document.getElementById('tooltip');

	for (const opinionSymbol of opinionSymbols) {
		const showTooltip = function() {
			const tooltipText = opinionSymbol.dataset.tooltipText;
			tooltip.textContent = tooltipText;
			
			const rect = this.getBoundingClientRect();
			const topPosition = rect.top + window.scrollY - tooltip.offsetHeight - 36;
			const leftPosition = rect.left - (rect.width / 2 + 6);
			
			tooltip.style.top = topPosition + 'px';
			tooltip.style.left = leftPosition + 'px';
			tooltip.style.display = 'block';
			tooltip.setAttribute('aria-hidden', 'false');
		};
	
		const hideTooltip = function() {
			tooltip.style.display = 'none';
			tooltip.setAttribute('aria-hidden', 'true');
		};

		opinionSymbol.addEventListener('mouseover', showTooltip);
		opinionSymbol.addEventListener('focus', showTooltip);
		opinionSymbol.addEventListener('mouseout', hideTooltip);
		opinionSymbol.addEventListener('blur', hideTooltip);
	}
};

const initCollapsibleLists = () => {
	const collapsibleLists = document.querySelectorAll(".collapsible");
	for (let c = 0; c < collapsibleLists.length; c++) {
		const list = collapsibleLists[c];
		const button = list.querySelector(":scope > header .collapsible-button");

		button.addEventListener("click", () => {
			const expanded = list.ariaExpanded !== "true";
			list.ariaExpanded = expanded;

			if (expanded) {
				// Close other lists in same sibling level
				const collapsibleType = list.dataset.collapsibleType;
				if (!collapsibleType) {
					return;
				}

				const siblings = Array.from(list.parentElement.children).filter((sibling) => {
					return sibling !== list && sibling.getAttribute('data-collapsible-type') === collapsibleType;
				});

				for (let s = 0; s < siblings.length; s++) {
					const siblingList = siblings[s];
					if (siblingList.ariaExpanded === "true") {
						siblingList.ariaExpanded = false;
					}
				}
			}
			else {
				// Close sub-lists
				const subLists = list.querySelectorAll(".collapsible");
				console.log(subLists);
				for (let s = 0; s < subLists.length; s++) {
					const subList = subLists[s];
					if (subList.ariaExpanded === "true") {
						console.log("Test");
						subList.ariaExpanded = false;
					}
				}
			}
		});
	}
};

const initTabLists = () => {
	const tabLists = document.querySelectorAll('[role="tablist"]');
	for (let l = 0; l < tabLists.length; l++) {
		const tabList = tabLists[l];
		const listId = tabList.id || "";

		tabs[listId] = {};

		const tabButtons = tabList.querySelectorAll('[role="tab"]');
		let selectedButton = null;

		for (let b = 0; b < tabButtons.length; b++) {
			const tabButton = tabButtons[b];
			const panelId = tabButton.getAttribute("aria-controls");
			const tabPanels = Array.from(document.querySelectorAll(`${panelId ? "#" + panelId : ""}[data-tab-list="${listId}"]`));

			if (tabButton.getAttribute("aria-selected") === "true") {
				selectedButton = tabButton;
			}

			tabButton.addEventListener("click", () => selectTab(listId, tabButton.id));
			tabs[listId][tabButton.id] = tabPanels;
		}

		if (selectedButton !== null) {
			selectTab(listId, selectedButton.id);
		}
	}
};

const selectTab = (listId, tabId) => {
	const tabList = tabs[listId];
	if (!tabList) return;

	for (const button in tabList) {
		const tabButton = document.querySelector("#" + button + '[role="tab"]');
		tabButton.setAttribute("aria-selected", tabButton.id === tabId);
		tabButton.disabled = tabButton.id === tabId;

		const tabPanels = tabList[tabButton.id];
		tabPanels.forEach(panel => panel.hidden = (tabButton.id !== tabId));
	}
};