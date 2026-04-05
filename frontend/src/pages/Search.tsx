import { useState } from "react";
import { Box, Heading, Button, Input, Text } from "@chakra-ui/react";
import { type Page, type PantryPage } from "../types";
import { saveFindRecipe } from "../storage";

interface Recipe {
	link: string;
	ingredients: string;
	instructions: string;
	appliances: string;
}

export default function SearchRecipe({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	const [recipeType, setRecipeType] = useState("");
	const [result, setResult] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [saved, setSaved] = useState(false);

	async function handleSearch() {
		if (!recipeType.trim()) return;
		setLoading(true);
		setError("");

		try {
			// step 1: start the job
			const res = await fetch("http://localhost:3001/find-recipe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ recipeType }),
			});
			const { jobId } = await res.json();

			// step 2: poll every 3 seconds until done
			const interval = setInterval(async () => {
				const poll = await fetch(`http://localhost:3001/find-recipe/${jobId}`);
				const data = await poll.json();

				if (data.status === "done") {
					clearInterval(interval);
					try {
						const parsed = data.output;
						setResult(parsed);
					} catch {
						setError("Could not parse recipe. Try again.");
					}
					setLoading(false);
				}
				// if "pending", do nothing and wait for next poll
			}, 3000);
		} catch {
			setError("Request failed");
			setLoading(false);
		}
	}

	async function handleSave() {
		if (!result) return;
		await saveFindRecipe({ ...result, recipeType });
		setSaved(true);
	}

	return (
		<Box p={6}>
			<Button onClick={() => setCurrentPage("home")}>← Back</Button>
			<Heading size="lg">Find a recipe</Heading>

			<Box mt={4}>
				<Input
					placeholder="What kind of recipe? (e.g. pasta, soup...)"
					value={recipeType}
					onChange={(e) => setRecipeType(e.target.value)}
				/>
				<Button
					mt={3}
					onClick={handleSearch}
					isDisabled={!recipeType.trim() || loading}
				>
					{loading ? "Searching..." : "Find Recipe"}
				</Button>
			</Box>

			{error && (
				<Text
					mt={3}
					color="red.500"
				>
					{error}
				</Text>
			)}

			{result && (
				<Box mt={4}>
					<Text fontWeight="bold">
						<a
							href={result.link}
							target="_blank"
							rel="noreferrer"
						>
							View Full Recipe
						</a>
					</Text>
					<Text
						fontWeight="bold"
						mt={3}
					>
						Ingredients
					</Text>
					<Text fontSize="sm">{result.ingredients}</Text>
					<Text
						fontWeight="bold"
						mt={3}
					>
						Instructions
					</Text>
					<Text fontSize="sm">{result.instructions}</Text>
					<Text
						fontWeight="bold"
						mt={3}
					>
						Appliances
					</Text>
					<Text fontSize="sm">{result.appliances}</Text>

					<Button
						mt={3}
						colorScheme="green"
						onClick={handleSave}
						isDisabled={saved}
					>
						{saved ? "Saved ✓" : "Save Recipe"}
					</Button>
				</Box>
			)}
		</Box>
	);
}
