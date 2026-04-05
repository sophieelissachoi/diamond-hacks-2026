import { useState } from "react";
import { Heading, Button, Box, Text, HStack } from "@chakra-ui/react";
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
	onCancel: () => void;
}

export default function EditConfirmation({
	ingredients,
	editButtonClicked,
	onBack,
	onCancel,
}: Props) {
	const [saved, setSaved] = useState(false);

	const [ingredientList, setIngredientList] = useState(
		ingredients.name.map((name, i) => ({
			name,
			category: ingredients.category[i],
			food: ingredients.food[i],
			quantity: ingredients.quantity[i],
		})),
	);

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
			bg="#F7F3EC"
			w="430px"
			h="560px"
			display="flex"
			flexDirection="column"
			overflow="hidden"
			p={6}
		>
			<Heading
				fontFamily="'Playfair Display', serif"
				fontSize="2xl"
				fontWeight="700"
				color="#1E3A0F"
				letterSpacing="0.05em"
				mb={3}
				flexShrink={0}
			>
				{editButtonClicked ? "Add" : "Confirm"} Pantry
			</Heading>

			{saved ? (
				<Box
					flex={1}
					display="flex"
					alignItems="center"
					justifyContent="center"
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
					{/* scrollable list */}
					<Box
						flex={1}
						overflowY="auto"
						mb={3}
						css={{
							"&::-webkit-scrollbar": { width: "4px" },
							"&::-webkit-scrollbar-thumb": {
								background: "#C8D8B8",
								borderRadius: "4px",
							},
						}}
					>
						{ingredientList.map((ingredient, index) => (
							<HStack
								key={index}
								align="start"
								mb={2}
							>
								<IngredientCard ingredient={ingredient} />
								<Button
									size="xs"
									variant="ghost"
									color="#C08080"
									_hover={{ color: "red.500", bg: "transparent" }}
									onClick={() =>
										setIngredientList((prev) => prev.filter((_, i) => i !== index))
									}
								>
									✕
								</Button>
							</HStack>
						))}
					</Box>

					{/* fixed bottom buttons */}
					<Box flexShrink={0}>
						<Button
							w="100%"
							bg="#4A7C2F"
							color="white"
							border="1.5px solid"
							borderColor="#4A7C2F"
							borderRadius="xl"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							fontWeight="500"
							_hover={{ bg: "white", color: "#2D5016", borderColor: "#C8D8B8" }}
							_active={{ bg: "#2D5016", color: "white" }}
							transition="all 0.2s"
							onClick={handleConfirm}
							mb={2}
						>
							Confirm & Save
						</Button>
						<Button
							w="100%"
							variant="ghost"
							color="#7A8F6A"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							_hover={{ color: "#2D5016", bg: "transparent" }}
							onClick={onCancel}
						>
							Cancel
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
}
