import express from "express";
import "dotenv/config";
import cors from "cors";
import { BrowserUse } from "browser-use-sdk/v3";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new BrowserUse();

// scans the receipt or pantry to see the ingredients
app.post("/scan-picture", async (req, res) => {
	const { picture, fileName, contentType } = req.body;
	if (!picture) return res.status(400).json({ error: "Missing picture" });

	const imageBuffer = Buffer.from(picture.split(",")[1], "base64");
	const tempPath = path.join(os.tmpdir(), fileName);
	fs.writeFileSync(tempPath, imageBuffer);

	const workspace = await client.workspaces.create({ name: "scan-workspace" });
	await client.workspaces.upload(workspace.id, tempPath);

	const result = await client.run(
		`Analyze this receipt image (${fileName}) and return a JSON object with these keys:
      name: array of product names
      category: array of categories (dairy, fruit, vegetables, snacks, grains, seasonings, protein, other)
      food: array of simplified food names (e.g. "Horizon Milk" → "milk")
      quantity: array of quantities bought
    Return only valid JSON, no explanation and no formatting. no additional text like (here is the valid json) or LLM result: json`,
		{ workspaceId: workspace.id },
	);

	fs.unlinkSync(tempPath);
	await client.workspaces.delete(workspace.id);

	console.log(result.output);
	return res.json({ output: result.output });
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
      substitute: contains the ingredients on the website that the user does not have in their chrome storage, 
			but can be substituted with the user’s ingredients in their chrome storage. Map the ingredients that can be substituted to existing ingredients in the user’s chrome storage.
			Also include the following
			"link": "the url of the recipe",
      "ingredients": "summary of ingredients",
      "instructions": "summary of instructions with tips",
      "appliances": "required appliances"
			Return only valid JSON, no explanation and no formatting. no additional text like (here is the valid json) or LLM result: json`,
		);
		return res.json({ output: result.output });
	} catch (err) {
		console.error("Browser Use error:", err);
		return res.status(500).json({ error: "Failed to run browser task " });
	}
});

// scrapes websites on the web to find the website that best fits the user's request
const jobs: Record<string, { status: string; output: string | null }> = {};

app.post("/find-recipe", async (req, res) => {
	const { recipeType } = req.body;
	if (!recipeType) return res.status(400).json({ error: "No type found" });

	const jobId = randomUUID();
	jobs[jobId] = { status: "pending", output: null };

	client
		.run(
			`Find a ${recipeType} recipe that I can make with the items in my pantry. 
    Select the highest rated one. 
    Open a new tab with the recipe and scroll down to the recipe page.
    Return ONLY a raw JSON object with no markdown, no backticks, no explanation, no extra text whatsoever.
	Do not write anything before or after the JSON object.
    The JSON must have exactly these keys:
    {
      "link": "the url of the recipe",
      "ingredients": "summary of ingredients",
      "instructions": "summary of instructions with tips",
      "appliances": "required appliances"
    }`,
		)
		.then((result) => {
			console.log("LLM result:", result.output); // is this line there?
			jobs[jobId] = { status: "done", output: result.output };
		})
		.catch((err) => {
			console.error("Browser Use error:", err);
			jobs[jobId] = { status: "error", output: null };
		});

	return res.json({ jobId }); // returns immediately
});

app.get("/find-recipe/:jobId", (req, res) => {
	const job = jobs[req.params.jobId];
	if (!job) return res.status(404).json({ error: "Job not found" });
	return res.json(job);
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
