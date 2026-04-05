import { useEffect, useState } from "react";
import { Heading, Box, Text, VStack, Divider, Button } from "@chakra-ui/react";
import { type Ingredient, type PantryPage } from "../types";

interface Props {
	setCurrentPagePantry: React.Dispatch<React.SetStateAction<PantryPage>>;
	category: string;
}

export default function SubPantry({ setCurrentPagePantry, category }: Props) {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);

	useEffect(() => {
		if (typeof chrome === "undefined" || !chrome.storage) {
			return;
		}
		chrome.storage.local.get(["pantry"], (result) => {
			const all: Ingredient[] = Array.isArray(result.pantry) ? result.pantry : [];
			const filtered = all.filter(
				(i) => i.category.toLowerCase() === category.toLowerCase(),
			);
			setIngredients(filtered);
		});
	}, [category]);

	return (
		<Box
			p={6}
			bg="#F7F3EC"
			w="500px"
			h="500px"
			display="flex"
			flexDirection="column"
			overflow="hidden"
		>
			<VStack
				align="start"
				gap={1}
				mb={4}
			>
				<Button
					variant="ghost"
					color="#7A8F6A"
					fontFamily="'Inter', sans-serif"
					fontSize="sm"
					px={0}
					_hover={{ color: "#2D5016", bg: "transparent" }}
					onClick={() => setCurrentPagePantry("pantry")}
				>
					← Back
				</Button>
				<Heading
					fontFamily="'Playfair Display', serif"
					fontSize="2xl"
					fontWeight="700"
					color="#1E3A0F"
					letterSpacing="0.05em"
				>
					{category}
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>

				{ingredients.length === 0 && (
					<Text
						mt={3}
						fontFamily="'Inter', sans-serif"
						color="#7A8F6A"
						fontSize="sm"
					>
						No items in {category} yet.
					</Text>
				)}

				{ingredients.map((item, i) => (
					<Box
						key={i}
						mt={3}
						p={3}
						bg="white"
						borderRadius="xl"
						border="1px solid"
						borderColor="#C8D8B8"
						w="100%"
					>
						<Text
							fontWeight="600"
							fontFamily="'Inter', sans-serif"
							color="#1E3A0F"
						>
							{item.food}
						</Text>
						<Text
							fontSize="sm"
							fontFamily="'Inter', sans-serif"
							color="#7A8F6A"
						>
							Qty: {item.quantity}
						</Text>
						{item.location && (
							<Text
								fontSize="sm"
								fontFamily="'Inter', sans-serif"
								color="#7A8F6A"
							>
								Location: {item.location}
							</Text>
						)}
						{item.note && (
							<Text
								fontSize="sm"
								fontFamily="'Inter', sans-serif"
								color="#7A8F6A"
							>
								Note: {item.note}
							</Text>
						)}
					</Box>
				))}
			</VStack>
		</Box>
	);
}
