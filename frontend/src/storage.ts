export interface Recipe {
	id: string;
	title: string;
	url: string;
	notes: string;
	savedAt: string;
}

// Save a recipe
export async function saveRecipe(
	recipe: Omit<Recipe, "id" | "savedAt">,
): Promise<void> {
	const existing = await getRecipes();
	const newRecipe: Recipe = {
		...recipe,
		id: crypto.randomUUID(),
		savedAt: new Date().toISOString(),
	};
	await chrome.storage.sync.set({ recipes: [...existing, newRecipe] });
}

// Get all recipes
export async function getRecipes(): Promise<Recipe[]> {
	const result = (await chrome.storage.sync.get("recipes")) as {
		recipes?: Recipe[];
	};
	return result.recipes ?? [];
}

// Delete a recipe by id
export async function deleteRecipe(id: string): Promise<void> {
	const existing = await getRecipes();
	await chrome.storage.sync.set({
		recipes: existing.filter((r) => r.id !== id),
	});
}
