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
				onBack();
				setTimeout(() => setSaved(false), 2000);
			});
		});
	}

	return (
		<Box
			p={6}
			pr={6}
			bg="#F7F3EC"
			w="500px"
			h="560px"
			display="flex"
			flexDirection="column"
			overflow="scroll"
		>
			<Heading
				size="md"
				fontFamily="'Playfair Display', serif"
				fontSize="2xl"
				fontWeight="700"
				color="#1E3A0F"
				letterSpacing="0.05em"
				mb={3}
			>
				{editButtonClicked ? "Add" : "Confirm"} Pantry
			</Heading>

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
						py={3}
						w="auto"
						h="200px"
						whiteSpace="normal"
						wordBreak="break-word"
						bg="#4A7C2F"
						color="white"
						border="1.5px solid"
						borderColor="#4A7C2F"
						borderRadius="2xl"
						fontFamily="'Inter', sans-serif"
						fontSize="md"
						fontWeight="500"
						letterSpacing="0.02em"
						_hover={{
							bg: "white",
							color: "#2D5016",
							borderColor: "#C8D8B8",
							transform: "translateY(-2px)",
							boxShadow: "0 4px 12px rgba(74,124,47,0.25)",
						}}
						_active={{ bg: "#2D5016", color: "white" }}
						transition="all 0.2s"
						onClick={handleConfirm}
					>
						Confirm & Save
					</Button>
				</>
			)}
		</Box>
	);
}
