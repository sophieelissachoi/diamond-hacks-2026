chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "HIGHLIGHT_INGREDIENTS") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabId = tabs[0].id!;
			chrome.scripting.executeScript({
				target: { tabId },
				func: (have: string[], need: string[], substitute: string) => {
					const allText = document.querySelectorAll("li, p, span, td");
					allText.forEach((el) => {
						const text = el.textContent?.toLowerCase() ?? "";
						const isHave = have.some((i) => text.includes(i.toLowerCase()));
						const isNeed = need.some((i) => text.includes(i.toLowerCase()));
						const isSub = substitute
							.split(",")
							.some((i) =>
								text.includes(i.toLowerCase().split("can substitute")[1]?.trim() ?? ""),
							);
						if (isHave) (el as HTMLElement).style.backgroundColor = "lightgreen";
						else if (isSub) (el as HTMLElement).style.backgroundColor = "lightblue";
						else if (isNeed)
							(el as HTMLElement).style.backgroundColor = "lightyellow";
					});
				},
				args: [message.have, message.need, message.substitute],
			});
		});
		sendResponse({ ok: true });
	}
	return true;
});
