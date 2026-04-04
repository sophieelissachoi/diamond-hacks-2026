export interface Recipe {
	id: string;
	title: string;
	url: string;
	notes: string;
	savedAt: string;
}

export interface Ingredient {
	id: string;
	name: string;
	food: string;
	category: string;
	quantity: number;
	location: string;
	notes: string;
	savedAt: string;
}

export async function saveIngredients(
	ingredient: Omit<Ingredient, "id" | "savedAt">,
): Promise<void> {
	const existing = await getIngredients();
	const newIngredient: Ingredient = {
		...ingredient,
		id: crypto.randomUUID(),
		savedAt: new Date().toISOString(),
	};
	await chrome.storage.sync.set({ ingredients: [...existing, newIngredient] });
}

// Get all ingredients
export async function getIngredients(): Promise<Ingredient[]> {
	const result = (await chrome.storage.sync.get("ingredients")) as {
		ingredients?: Ingredient[];
	};
	return result.ingredients ?? [];
}

// Delete a ingredient by id
export async function deleteIngredient(id: string): Promise<void> {
	const existing = await getIngredients();
	await chrome.storage.sync.set({
		ingredients: existing.filter((r) => r.id !== id),
	});
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
