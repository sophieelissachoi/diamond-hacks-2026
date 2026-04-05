chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "HIGHLIGHT_INGREDIENTS") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabId = tabs[0].id!;
			chrome.scripting.executeScript({
				target: { tabId },
				func: (have: string[], need: string[], substitute: string) => {
					const allText = document.querySelectorAll("li, p, span, td");

					const subTargets = (
						Array.isArray(substitute) ? substitute : substitute.split(",")
					)
						.map((s) => {
							const parts = s.toLowerCase().split("can substitute");
							return parts[1]?.trim() ?? "";
						})
						.filter(Boolean);

					const stripQuantity = (s: string) =>
						s
							.toLowerCase()
							.replace(
								/[\d½¼¾⅓⅔]+\s*(g|kg|tablespoon|teaspoon|cup|oz|lb|ml|l)?\s*/gi,
								"",
							)
							.replace(/\(.*?\)/g, "")
							.trim();

					const haveKeywords = have.map(stripQuantity).filter((k) => k.length > 3);
					const needKeywords = need.map(stripQuantity).filter((k) => k.length > 3);

					allText.forEach((el) => {
						const text = el.textContent?.toLowerCase() ?? "";

						const isSub = subTargets.some((i) => i.length > 3 && text.includes(i));
						const isHave = !isSub && haveKeywords.some((i) => text.includes(i));
						const isNeed =
							!isSub && !isHave && needKeywords.some((i) => text.includes(i));

						if (isHave) (el as HTMLElement).style.backgroundColor = "#95fc7e";
						else if (isSub) (el as HTMLElement).style.backgroundColor = "#fcf47e";
						else if (isNeed) (el as HTMLElement).style.backgroundColor = "#fc7e89";
					});
				},
				args: [message.have, message.need, message.substitute],
			});
		});
		sendResponse({ ok: true });
	}
	return true;
});
