import { Box, Text } from "@chakra-ui/react";
import { type Ingredient } from "../types";

interface Props {
	ingredient: Ingredient;
	//onChange: (updated: Ingredient) => void;
}

export default function IngredientCard({ ingredient }: Props) {
	// if (editing) {
	// 	return (
	// 		<Box
	// 			border="1px"
	// 			borderRadius="md"
	// 			p={3}
	// 			mt={2}
	// 		>
	// 			<Text fontWeight="bold">Name</Text>
	// 			<Input
	// 				value={local.name}
	// 				onChange={(e) => handleChange("name", e.target.value)}
	// 			/>

	// 			<Text
	// 				fontWeight="bold"
	// 				mt={2}
	// 			>
	// 				Category
	// 			</Text>
	// 			<Input
	// 				value={local.category}
	// 				onChange={(e) => handleChange("category", e.target.value)}
	// 			/>

	// 			<Text
	// 				fontWeight="bold"
	// 				mt={2}
	// 			>
	// 				Food
	// 			</Text>
	// 			<Input
	// 				value={local.food}
	// 				onChange={(e) => handleChange("food", e.target.value)}
	// 			/>

	// 			<Text
	// 				fontWeight="bold"
	// 				mt={2}
	// 			>
	// 				Quantity
	// 			</Text>
	// 			<Input
	// 				value={local.quantity}
	// 				onChange={(e) => handleChange("quantity", e.target.value)}
	// 			/>

	// 			<Text
	// 				fontWeight="bold"
	// 				mt={2}
	// 			>
	// 				Location (optional)
	// 			</Text>
	// 			<Input
	// 				value={local.location ?? ""}
	// 				onChange={(e) => handleChange("location", e.target.value)}
	// 			/>

	// 			<Text
	// 				fontWeight="bold"
	// 				mt={2}
	// 			>
	// 				Note (optional)
	// 			</Text>
	// 			<Input
	// 				value={local.note ?? ""}
	// 				onChange={(e) => handleChange("note", e.target.value)}
	// 			/>

	// 			<Button
	// 				mt={3}
	// 				onClick={handleSave}
	// 			>
	// 				Save
	// 			</Button>
	// 			<Button
	// 				mt={3}
	// 				ml={2}
	// 				variant="ghost"
	// 				onClick={() => setEditing(false)}
	// 			>
	// 				Cancel
	// 			</Button>
	// 		</Box>
	// 	);
	// }

	return (
		<Box
			border="1px"
			borderRadius="md"
			bg="white"
			p={3}
			mt={2}
		>
			<Text fontWeight="bold">{ingredient.name}</Text>
			<Text fontSize="sm">Category: {ingredient.category}</Text>
			<Text fontSize="sm">Food: {ingredient.food}</Text>
			<Text fontSize="sm">Quantity: {ingredient.quantity}</Text>
			{/*local.location && <Text fontSize="sm">Location: {local.location}</Text>*/}
			{/*local.note && <Text fontSize="sm">Note: {local.note}</Text>()*/}
			{/* <Button
				mt={2}
				size="sm"
				onClick={() => setEditing(true)}
			>
				Edit
			</Button> */}
		</Box>
	);
}
