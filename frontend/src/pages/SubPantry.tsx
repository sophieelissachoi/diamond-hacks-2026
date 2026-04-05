import { useEffect, useState } from "react";
import {
	Heading,
	Box,
	Text,
	VStack,
	Divider,
	Button,
	HStack,
	Input,
} from "@chakra-ui/react";
import { type Ingredient, type PantryPage } from "../types";

interface Props {
	setCurrentPagePantry: React.Dispatch<React.SetStateAction<PantryPage>>;
	category: string;
}

export default function SubPantry({ setCurrentPagePantry, category }: Props) {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [newFood, setNewFood] = useState("");
	const [newQuantity, setNewQuantity] = useState("");

	useEffect(() => {
		if (typeof chrome === "undefined" || !chrome.storage) return;
		chrome.storage.local.get(["pantry"], (result) => {
			const all: Ingredient[] = Array.isArray(result.pantry) ? result.pantry : [];
			const filtered = all.filter(
				(i) => i.category.toLowerCase() === category.toLowerCase(),
			);
			setIngredients(filtered);
		});
	}, [category]);

	function handleAdd() {
		if (!newFood.trim()) return;
		const newItem: Ingredient = {
			name: newFood,
			food: newFood,
			category,
			quantity: Number(newQuantity) || 1,
		};

		chrome.storage.local.get(["pantry"], (result) => {
			const all: Ingredient[] = Array.isArray(result.pantry) ? result.pantry : [];
			const updated = [...all, newItem];
			chrome.storage.local.set({ pantry: updated }, () => {
				setIngredients((prev) => [...prev, newItem]);
				setNewFood("");
				setNewQuantity("");
			});
		});
	}

	function handleDelete(index: number) {
		chrome.storage.local.get(["pantry"], (result) => {
			const all: Ingredient[] = Array.isArray(result.pantry) ? result.pantry : [];
			let deleted = false;
			const updated = all.filter((i) => {
				if (
					!deleted &&
					i.food === ingredients[index].food &&
					i.category === category
				) {
					deleted = true;
					return false;
				}
				return true;
			});
			chrome.storage.local.set({ pantry: updated }, () => {
				setIngredients((prev) => prev.filter((_, i) => i !== index));
			});
		});
	}

	return (
		<Box
			bg="#F7F3EC"
			w="430px"
			minH="560px"
			p={6}
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
			</VStack>

			{/* add new item */}
			<HStack mb={4}>
				<Input
					placeholder="Food name"
					value={newFood}
					onChange={(e) => setNewFood(e.target.value)}
					bg="white"
					border="1.5px solid"
					borderColor="#C8D8B8"
					borderRadius="xl"
					fontFamily="'Inter', sans-serif"
					fontSize="sm"
					_focus={{ borderColor: "#4A7C2F", boxShadow: "none" }}
					_placeholder={{ color: "#B0BEA4" }}
				/>
				<Input
					placeholder="Qty"
					value={newQuantity}
					onChange={(e) => setNewQuantity(e.target.value)}
					bg="white"
					border="1.5px solid"
					borderColor="#C8D8B8"
					borderRadius="xl"
					fontFamily="'Inter', sans-serif"
					fontSize="sm"
					w="70px"
					_focus={{ borderColor: "#4A7C2F", boxShadow: "none" }}
					_placeholder={{ color: "#B0BEA4" }}
				/>
				<Button
					onClick={handleAdd}
					bg="#4A7C2F"
					color="white"
					borderRadius="xl"
					fontFamily="'Inter', sans-serif"
					fontSize="sm"
					_hover={{
						bg: "white",
						color: "#2D5016",
						border: "1.5px solid",
						borderColor: "#C8D8B8",
					}}
					transition="all 0.2s"
				>
					Add
				</Button>
			</HStack>

			{/* ingredient list */}
			{ingredients.length === 0 && (
				<Text
					color="gray.400"
					fontSize="sm"
					fontFamily="'Inter', sans-serif"
				>
					No items in {category} yet.
				</Text>
			)}
			<VStack
				align="stretch"
				gap={2}
			>
				{ingredients.map((item, index) => (
					<Box
						key={index}
						p={3}
						bg="white"
						borderRadius="xl"
						border="1.5px solid"
						borderColor="#C8D8B8"
					>
						<HStack justify="space-between">
							<Box>
								<Text
									fontFamily="'Inter', sans-serif"
									fontWeight="600"
									fontSize="sm"
									color="#1E3A0F"
								>
									{item.food}
								</Text>
								<Text
									fontFamily="'Inter', sans-serif"
									fontSize="xs"
									color="#7A8F6A"
								>
									Qty: {item.quantity}
								</Text>
							</Box>
							<Button
								size="xs"
								variant="ghost"
								color="#C08080"
								_hover={{ color: "red.500", bg: "transparent" }}
								onClick={() => handleDelete(index)}
							>
								✕
							</Button>
						</HStack>
					</Box>
				))}
			</VStack>
		</Box>
	);
}
