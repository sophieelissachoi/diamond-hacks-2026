import { Heading, Button, Box, Text } from "@chakra-ui/react";
import { type Ingredient } from "../types";
import IngredientCard from "../components/IngredientCard";

interface Props {
	ingredients: Ingredient[];
	setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
	editButtonClicked: boolean;
}

export default function EditConfirmation({
	ingredients,
	setIngredients,
	editButtonClicked,
}: Props) {
	function handleChange(index: number, updated: Ingredient) {
		setIngredients((prev) =>
			prev.map((item, i) => (i === index ? updated : item)),
		);
	}

	function handleConfirm() {
		console.log("Confirmed ingredients:", ingredients);
	}

	return (
		<Box p={4}>
			<Heading size="md">{editButtonClicked ? "Add" : "Confirm"} Pantry</Heading>
			<Text>{JSON.stringify(ingredients)}</Text>
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
