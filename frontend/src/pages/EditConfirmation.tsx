import { useState } from "react";
import { Heading, Button, Box, Text } from "@chakra-ui/react";
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
	onBack: () => void;
}

export default function EditConfirmation({
	ingredients,
	editButtonClicked,
	onBack,
}: Props) {
	const [saved, setSaved] = useState(false);

	const ingredientList = ingredients.name.map((name, i) => ({
		name,
		category: ingredients.category[i],
		food: ingredients.food[i],
		quantity: ingredients.quantity[i],
	}));

	function handleConfirm() {
		chrome.storage.local.get(["pantry"], (result) => {
			const existing: Ingredient[] = Array.isArray(result.pantry)
				? result.pantry
				: [];
			const updated = [...existing, ...ingredientList];
			chrome.storage.local.set({ pantry: updated }, () => {
				setSaved(true);
				setTimeout(() => onBack(), 3000);
			});
		});
	}

	return (
		<Box p={4}>
			<Heading size="md">{editButtonClicked ? "Add" : "Confirm"} Pantry</Heading>

			{saved ? (
				<Box
					mt={4}
					textAlign="center"
				>
					<Text
						color="#4A7C2F"
						fontWeight="600"
						fontSize="lg"
					>
						✓ Saved!
					</Text>
				</Box>
			) : (
				<>
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
				</>
			)}
		</Box>
	);
}
