import express from "express";
import "dotenv/config";
import cors from "cors";
import { BrowserUse } from "browser-use-sdk";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const client = new BrowserUse();

// scans the receipt or pantry to see the ingredients
app.post("/scan-picture", async (req, res) => {
	const { picture } = req.body;

	if (!picture) {
		return res.status(400).json({ error: "Missing or invalid 'task' field" });
	}

	try {
		const result = await client.run(
			`Return a json object that has the following keys based on the following picture of the receipt or pantry. ${picture}
      name: list the name of each product.
      category: categorize each ingredient and food item of the receipt into dairy, fruit, vegetables, snacks, grains, seasonings, protein, and other.
      food: (i.e. Horizon milk just becomes milk).
      quantity: how much of the product the person bought (i.e. if they bought a carton of a dozen eggs, for example, count it as a dozen).`,
		);
		return res.json({ output: result.output });
	} catch (err) {
		console.error("Browser Use error:", err);
		return res.status(500).json({ error: "Failed to run browser task" });
	}
});

// scans the website the user is on to see if they have the ingredients they need
app.post("/find-ingredients", async (req, res) => {
	const { url } = req.body;

	if (!url) {
		return res.status(400).json({ error: "No url found" });
	}

	try {
		const result = await client.run(
			`In ${url}, scroll down to the recipe list and return a json object with the following. 
      have: contains the ingredients on the website that are in the user’s chrome storage.
      need: contains the ingredients on the website that are not in the user’s chrome storage.
      substitute: contains the ingredients on the website that the user does not have in their chrome storage, but can be substituted with the user’s ingredients in their chrome storage. Map the ingredients that can be substituted to existing ingredients in the user’s chrome storage`,
		);
		return res.json({ output: result.output });
	} catch (err) {
		console.error("Browser Use error:", err);
		return res.status(500).json({ error: "Failed to run browser task " });
	}
});

// scrapes websites on the web to find the website that best fits the user's request
app.post("/find-recipe", async (req, res) => {
	const { recipeType } = req.body;

	if (!recipeType) {
		return res.status(400).json({ error: "No type found" });
	}

	try {
		const result = await client.run(
			`Find a ${recipeType} recipe that I can make with the items in my pantry. 
      Select the highest rated one. 
      Open a new tab with the recipe and scroll down to the recipe page.
      Save the link in a json object.
      Also summarize the ingredients, instructions (incorporate important tips and tricks), and appliances required.
      Store it in the same json object as the link`,
		);
		return res.json({ output: result.output });
	} catch (err) {
		console.error("Browser Use error:", err);
		return res.status(500).json({ error: "Failed to run browser task" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
