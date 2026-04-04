import { useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import "dotenv/config";
import { type Recipe, saveRecipe, getRecipes, deleteRecipe } from "./storage";

import "./App.css";

function App() {
	//storage code
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [url, setUrl] = useState("");

	useEffect(() => {
		getRecipes().then(setRecipes);
	}, []);

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			setUrl(tabs[0]?.url ?? "");
		});
	}, []);

	async function handleSave() {
		if (!title.trim()) return;
		await saveRecipe({ title, url, notes });
		setRecipes(await getRecipes());
		setTitle("");
		setNotes("");
	}

	async function handleDelete(id: string) {
		await deleteRecipe(id);
		setRecipes(await getRecipes());
	}

	return (
		<>
			<Heading> hi </Heading>

			<input
				placeholder="Recipe title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<textarea
				placeholder="Notes (optional)"
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
			/>
			<button onClick={handleSave}>Save Recipe</button>

			{recipes.map((r) => (
				<div key={r.id}>
					<a
						href={r.url}
						target="_blank"
						rel="noreferrer"
					>
						{r.title}
					</a>
					<p>{r.notes}</p>
					<button onClick={() => handleDelete(r.id)}>Delete</button>
				</div>
			))}
		</>
	);
}

export default App;
