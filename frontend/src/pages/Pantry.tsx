import { useState } from "react";
import {
	VStack,
	Heading,
	Button,
	Grid,
	GridItem,
	HStack,
} from "@chakra-ui/react";
import UploadReceipt from "./Upload";
import TakePicture from "./TakePicture";
import { type PantryPage, type Page, type Ingredient } from "../types";
import SubPantry from "./SubPantry";
import EditConfirmation from "./EditConfirmation";

export default function Pantry({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	const [currentPagePantry, setCurrentPagePantry] =
		useState<PantryPage>("pantry");
	const [category, setCategory] = useState<string>("");
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);

	const categories = [
		"Dairy",
		"Fruit",
		"Vegetables",
		"Snacks",
		"Grains",
		"Seasonings",
		"Protein",
		"Other",
		"See All",
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
					// onDone={(sortedIngredients) => {
					// 	setIngredients(sortedIngredients);
					// 	setCurrentPagePantry("edit-confirmation");
					// }}
					/>
				)}
				{currentPagePantry === "edit-confirmation" && (
					<EditConfirmation
						ingredients={ingredients}
						setIngredients={setIngredients}
						editButtonClicked={false}
					/>
				)}
			</>
		);
	}

	return (
		<VStack
			p={6}
			mt={20}
			w="300px"
			h="300px"
			display="flex"
			justifyContent="center"
			alignItems="center"
		>
			<HStack>
				<Button onClick={() => setCurrentPagePantry("upload-receipt")}>
					Upload Receipt
				</Button>

				<Button onClick={() => setCurrentPagePantry("take-picture")}>
					Take Picture of Reciept/Pantry
				</Button>
			</HStack>
			<HStack>
				<Button onClick={() => setCurrentPage("home")}>← Back</Button>
				<Heading size="lg">Your Pantry</Heading>
			</HStack>

			<Grid
				mt={4}
				gap={2}
				templateColumns="repeat(3, 1fr)"
			>
				{categories.map((c) => (
					<GridItem key={c}>
						<Button
							w="100px"
							h="100px"
							onClick={() => {
								setCurrentPagePantry("subpantry");
								setCategory(c);
							}}
						>
							{c}
						</Button>
					</GridItem>
				))}
			</Grid>
		</VStack>
	);
}
