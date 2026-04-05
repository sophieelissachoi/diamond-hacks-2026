export type Page =
	| "home"
	| "Search Recipe"
	| "Saved Recipes"
	| "Scan Recipe"
	| "Pantry";

export type PantryPage =
	| "pantry"
	| "subpantry"
	| "upload-receipt"
	| "take-picture"
	| "edit-confirmation";

export interface Ingredient {
	name: string;
	category: string;
	food: string;
	quantity: number;
	location?: string;
	note?: string;
}

export interface RawIngredients {
	name: string[];
	category: string[];
	food: string[];
	quantity: number[];
}
