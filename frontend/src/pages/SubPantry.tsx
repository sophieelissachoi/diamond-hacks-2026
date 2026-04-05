import { useEffect, useState } from "react";
import { Heading, Box, Text } from "@chakra-ui/react";
import { type Ingredient } from "../types";

interface Props {
	category: string;
}

export default function SubPantry({ category }: Props) {
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
		<Box p={4}>
			<Heading size="md">{category}</Heading>
			{ingredients.length === 0 && (
				<Text
					mt={3}
					color="gray.500"
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
				>
					<Text fontWeight="600">{item.food}</Text>
					<Text
						fontSize="sm"
						color="gray.500"
					>
						Qty: {item.quantity}
					</Text>
					{item.location && (
						<Text
							fontSize="sm"
							color="gray.500"
						>
							Location: {item.location}
						</Text>
					)}
					{item.note && (
						<Text
							fontSize="sm"
							color="gray.500"
						>
							Note: {item.note}
						</Text>
					)}
				</Box>
			))}
		</Box>
	);
}
