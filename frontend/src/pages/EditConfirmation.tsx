import { Heading } from "@chakra-ui/react";

interface Props {
	ingredients: string[];
	editButtonClicked: boolean;
}

export default function EditConfirmation({
	ingredients,
	editButtonClicked,
}: Props) {
	return (
		<>
			<Heading size="md">
				{editButtonClicked ? "Edit" : "Confirm"} Ingredients
			</Heading>
			{ingredients.map((item, i) => (
				<div key={i}>{item}</div>
			))}
		</>
	);
}
