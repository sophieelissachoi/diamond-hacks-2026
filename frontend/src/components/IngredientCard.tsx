import { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

interface Ingredient {
	name: string;
	category: string;
	food: string;
	quantity: string;
	location?: string;
	note?: string;
}

interface Props {
	ingredient: Ingredient;
	onChange: (updated: Ingredient) => void;
}

export default function IngredientCard({ ingredient, onChange }: Props) {
	const [editing, setEditing] = useState(false);
	const [local, setLocal] = useState<Ingredient>(ingredient);

	function handleChange(field: keyof Ingredient, value: string) {
		setLocal((prev) => ({ ...prev, [field]: value }));
	}

	function handleSave() {
		onChange(local);
		setEditing(false);
	}

	if (editing) {
		return (
			<Box
				border="1px"
				borderRadius="md"
				p={3}
				mt={2}
			>
				<Text fontWeight="bold">Name</Text>
				<Input
					value={local.name}
					onChange={(e) => handleChange("name", e.target.value)}
				/>

				<Text
					fontWeight="bold"
					mt={2}
				>
					Category
				</Text>
				<Input
					value={local.category}
					onChange={(e) => handleChange("category", e.target.value)}
				/>

				<Text
					fontWeight="bold"
					mt={2}
				>
					Food
				</Text>
				<Input
					value={local.food}
					onChange={(e) => handleChange("food", e.target.value)}
				/>

				<Text
					fontWeight="bold"
					mt={2}
				>
					Quantity
				</Text>
				<Input
					value={local.quantity}
					onChange={(e) => handleChange("quantity", e.target.value)}
				/>

				<Text
					fontWeight="bold"
					mt={2}
				>
					Location (optional)
				</Text>
				<Input
					value={local.location ?? ""}
					onChange={(e) => handleChange("location", e.target.value)}
				/>

				<Text
					fontWeight="bold"
					mt={2}
				>
					Note (optional)
				</Text>
				<Input
					value={local.note ?? ""}
					onChange={(e) => handleChange("note", e.target.value)}
				/>

				<Button
					mt={3}
					onClick={handleSave}
				>
					Save
				</Button>
				<Button
					mt={3}
					ml={2}
					variant="ghost"
					onClick={() => setEditing(false)}
				>
					Cancel
				</Button>
			</Box>
		);
	}

	return (
		<Box
			border="1px"
			borderRadius="md"
			p={3}
			mt={2}
		>
			<Text fontWeight="bold">{local.name}</Text>
			<Text fontSize="sm">Category: {local.category}</Text>
			<Text fontSize="sm">Food: {local.food}</Text>
			<Text fontSize="sm">Quantity: {local.quantity}</Text>
			{local.location && <Text fontSize="sm">Location: {local.location}</Text>}
			{local.note && <Text fontSize="sm">Note: {local.note}</Text>}
			<Button
				mt={2}
				size="sm"
				onClick={() => setEditing(true)}
			>
				Edit
			</Button>
		</Box>
	);
}
