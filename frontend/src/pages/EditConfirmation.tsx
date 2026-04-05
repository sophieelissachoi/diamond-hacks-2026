import { Heading, Button, Box } from "@chakra-ui/react";
import { type Ingredient } from "../types";
import IngredientCard from "../components/IngredientCard";

interface RawIngredients {
	name: string[];
	category: string[];
	food: string[];
	quantity: number[];
}

interface Props {
	ingredients: RawIngredients;
	setIngredients: React.Dispatch<React.SetStateAction<RawIngredients>>;
	editButtonClicked: boolean;
}

export default function EditConfirmation({
	ingredients,
	editButtonClicked,
}: Props) {
	const ingredientList = ingredients.name.map((name, i) => ({
		name,
		category: ingredients.category[i],
		food: ingredients.food[i],
		quantity: ingredients.quantity[i],
	}));

	function handleConfirm() {
		chrome.storage.local.get(["pantry"], (result) => {
			const existing = result.pantry || [];
			const updated = [...existing, ...ingredientList];
			chrome.storage.local.set({ pantry: updated }, () => {
				console.log("Saved to pantry:", updated);
			});
		});
	}

	return (
		<Box p={4}>
			<Heading size="md">{editButtonClicked ? "Add" : "Confirm"} Pantry</Heading>
			{ingredientList.map((ingredient) => (
				<IngredientCard
					key={ingredient.name}
					ingredient={ingredient}
				/>
			))}
			<Button
				mt={4}
				colorScheme="green"
				onClick={handleConfirm}
			>
				Confirm & Save
			</Button>
		</Box>
	);
}
