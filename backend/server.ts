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
app.post("/scan", async (req, res) => {
	const { task } = req.body;

	if (!task || typeof task !== "string") {
		return res.status(400).json({ error: "Missing or invalid 'task' field" });
	}

	try {
		const result = await client.run(task);
		return res.json({ output: result.output });
	} catch (err) {
		console.error("Browser Use error:", err);
		return res.status(500).json({ error: "Failed to run browser task" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
