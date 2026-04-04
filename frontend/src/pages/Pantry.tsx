import { useState } from "react";
import { Box, Heading, Button } from "@chakra-ui/react";
import UploadReceipt from "./Upload";
import TakePicture from "./TakePicture";
import EditConfirmation from "./EditConfirmation";
import { type PantryPage, type Page } from "../types";
import SubPantry from "./SubPantry";

export default function Pantry({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	const [currentPagePantry, setCurrentPagePantry] =
		useState<PantryPage>("pantry");
	const [category, setCategory] = useState<string>("");
	const [ingredients, setIngredients] = useState<string[]>([]);
	const [editButtonClicked, setEditButtonClicked] = useState<boolean>(false);

	const categories = [
		"Dairy",
		"Fruit",
		"Vegetables",
		"Snacks",
		"Grains",
		"Seasonings",
		"Protein",
		"Other",
	];

	if (currentPagePantry !== "pantry") {
		return (
			<>
				<Button onClick={() => setCurrentPagePantry("pantry")}>← Back</Button>
				{currentPagePantry === "subpantry" && <SubPantry category={category} />}
				{currentPagePantry === "upload-receipt" && (
					<UploadReceipt
						onDone={(sortedIngredients) => {
							setIngredients(sortedIngredients);
							setCurrentPagePantry("edit-confirmation");
						}}
					/>
				)}
				{currentPagePantry === "take-picture" && (
					<TakePicture
						onDone={(sortedIngredients) => {
							setIngredients(sortedIngredients);
							setCurrentPagePantry("edit-confirmation");
						}}
					/>
				)}
				{currentPagePantry === "edit-confirmation" && (
					<EditConfirmation
						ingredients={ingredients}
						editButtonClicked={editButtonClicked}
					/>
				)}
			</>
		);
	}

	return (
		<Box p={6}>
			<Button onClick={() => setCurrentPage("home")}>← Back</Button>
			<Heading size="lg">Your Pantry</Heading>

			<Box mt={4}>
				{categories.map((c) => (
					<Button
						key={c}
						onClick={() => {
							setCurrentPagePantry("subpantry");
							setCategory(c);
						}}
					>
						{c}
					</Button>
				))}

				{/*upload and picture*/}
				<Button onClick={() => setCurrentPagePantry("upload-receipt")}>
					Upload Receipt
				</Button>
				<Button onClick={() => setCurrentPagePantry("take-picture")}>
					Take Picture of Reciept
				</Button>
				<Button
					onClick={() => {
						setCurrentPagePantry("edit-confirmation");
						setEditButtonClicked(true);
					}}
				>
					Edit Pantry
				</Button>
			</Box>
		</Box>
	);
}
