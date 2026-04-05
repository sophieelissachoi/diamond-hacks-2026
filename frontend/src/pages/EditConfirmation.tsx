import { Heading, Button, Box, Text } from "@chakra-ui/react";
import { type Ingredient } from "../types";
//import IngredientCard from "../components/IngredientCard";

interface Props {
	ingredients: Ingredient[];
	setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
	editButtonClicked: boolean;
}

export default function EditConfirmation({
	ingredients,
	//setIngredients,
	editButtonClicked,
}: Props) {
	function handleConfirm() {
		chrome.storage.local.get(["pantry"], (result) => {
			const existing: Ingredient[] = result.pantry || [];
			const updated = [...existing, ...ingredients];
			chrome.storage.local.set({ pantry: updated }, () => {
				console.log("Saved to pantry:", updated);
			});
		});
	}

	return (
		<Box p={4}>
			<Heading size="md">{editButtonClicked ? "Add" : "Confirm"} Pantry</Heading>
			<Text>{typeof ingredients}</Text>
			{/* {ingredients.map((i) => (
				<IngredientCard
					key={i.name}
					ingredient={{
						name: i.name,
						category: i.category,
						food: i.food,
						quantity: i.quantity,
					}}
				/>
			))} */}
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
