# Mise

> *Mise en place* — everything in its place, before you start cooking.

Mise is a Chrome extension that acts as your personal kitchen assistant. It scans your receipts, tracks your pantry, and uses AI to find recipes that work with what you already have — so you can spend less time planning and more time cooking.

---

## Features

### Virtual Pantry
Maintain a categorized digital pantry across 9 ingredient categories. Add items manually, delete what you don't need, and always know exactly what you have on hand.

### Receipt Scanning
Upload a PNG or JPEG of your grocery receipt (or snap a photo), and Mise uses an AI agent to parse every item and automatically categorize it into your pantry. Review the parsed list, remove any errors, then confirm and save.

### AI Recipe Search
Search for a recipe and Mise's AI agent scrapes the web for the highest-rated result that matches your available ingredients. It returns the recipe link, full ingredient list, step-by-step instructions, and required appliances — all inside the extension.

### Recipe Book
Save recipes you love directly to your personal recipe book within the extension. Revisit and delete saved recipes any time.

### Live Recipe Page Scanner
Browsing a recipe site? Mise can scan the page you're on and instantly tell you what you have, what you're missing, and what can be substituted:
- **Green** — ingredient in your pantry
- **Red** — ingredient missing
- **Yellow** — viable substitute available

Results are highlighted directly on the page and also displayed within the extension.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Chakra UI |
| Backend | Node.js / Express |
| AI Agent | Browser Use |
| Storage | `chrome.storage` (offline, cross-device) |
| Architecture | Polling-based async task handling |

---

## Getting Started

### Prerequisites
- Node.js
- Google Chrome

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mise.git
   cd mise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable **Developer Mode** (top right)
   - Click **Load unpacked**
   - Select the `dist/` folder

---

## How It Works

1. **Add your groceries** — upload a receipt or add items manually to your virtual pantry.
2. **Search for a recipe** — Mise's AI agent browses the web and finds the best match using your available ingredients.
3. **Cook with confidence** — scan any recipe page to see exactly what you have, what you're missing, and what you can substitute.
4. **Save your favorites** — build a personal recipe book you can return to anytime.

---

## Challenges & Learnings

- **Prompt engineering** — getting the LLM to return clean, structured JSON consistently required extensive iteration.
- **Chrome extension constraints** — working around fetch timeouts, CORS restrictions, and content script limitations for HTML injection.
- **Async architecture** — designing a polling system to handle long-running AI tasks without blocking the UI.
- **`chrome.storage`** — implementing offline, cross-device persistence within the extension sandbox.

---

## What's Next

- Full edit functionality on the pantry confirmation page and all list views
- Session state persistence so progress isn't lost if the extension is closed
- Improved onboarding with clearer in-app instructions and guidance
- Polished, fully reliable HTML injection for ingredient highlighting on recipe pages

---

## Built at [Hackathon Name]

*Mise was built to solve the small, everyday frustrations of cooking — so that getting into the kitchen feels less like a chore and more like something you can just dive into.*
