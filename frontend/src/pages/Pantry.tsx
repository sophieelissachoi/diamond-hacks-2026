import { useState } from "react";
import {
	VStack,
	Heading,
	Button,
	Grid,
	GridItem,
	HStack,
	Divider,
	Box,
	Text,
} from "@chakra-ui/react";
import UploadReceipt from "./Upload";
import TakePicture from "./TakePicture";
import { type PantryPage, type Page, type RawIngredients } from "../types";
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
	const [ingredients, setIngredients] = useState<RawIngredients>({
		name: [],
		category: [],
		food: [],
		quantity: [],
	});
	const [showSaved, setShowSaved] = useState(false);

	const categories = [
		"Dairy",
		"Vegetables",
		"Fruit",
		"Grains",
		"Protein",
		"Seasonings",
		"Snacks",
		"Other",
		"See All",
	];

	if (currentPagePantry !== "pantry") {
		return (
			<>
				{currentPagePantry === "subpantry" && (
					<SubPantry
						setCurrentPagePantry={setCurrentPagePantry}
						category={category}
					/>
				)}
				{currentPagePantry === "upload-receipt" && (
					<UploadReceipt
						setCurrentPagePantry={setCurrentPagePantry}
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
						onBack={() => {
							setShowSaved(true);
							setTimeout(() => setShowSaved(false), 2000);
							setCurrentPagePantry("pantry");
						}}
					/>
				)}
			</>
		);
	}

	return (
		<Box
			position="relative"
			p={6}
			bg="#F7F3EC"
			w="430px"
			h="560px"
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
					onClick={() => setCurrentPage("home")}
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
					Your Pantry
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>

				<HStack mt={2}>
					<Button
						fontFamily="'Inter', sans-serif"
						fontSize="sm"
						bg="#7A8F6A"
						color="white"
						_hover={{ bg: "#2D5016" }}
						onClick={() => setCurrentPagePantry("upload-receipt")}
					>
						Upload Receipt
					</Button>
					<Button
						fontFamily="'Inter', sans-serif"
						fontSize="sm"
						bg="#7A8F6A"
						color="white"
						_hover={{ bg: "#2D5016" }}
						onClick={() => setCurrentPagePantry("take-picture")}
					>
						Take Picture of Reciept/Pantry
					</Button>
				</HStack>

				<Grid
					mt={4}
					gap={2}
					templateColumns="repeat(3, 1fr)"
				>
					{categories.map((c) => (
						<GridItem key={c}>
							<Button
								w="120px"
								h="110px"
								whiteSpace="normal"
								wordBreak="break-word"
								bg="#4A7C2F"
								color="white"
								border="1.5px solid"
								borderColor="#4A7C2F"
								borderRadius="2xl"
								fontFamily="'Inter', sans-serif"
								fontSize="sm"
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
								sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
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

			{/* toast overlay */}
			{showSaved && (
				<Box
					position="absolute"
					bottom="24px"
					left="50%"
					transform="translateX(-50%)"
					bg="whiteAlpha.900"
					px={5}
					py={3}
					borderRadius="xl"
					boxShadow="md"
					border="1px solid"
					borderColor="#C8D8B8"
					animation="fadeInOut 2s ease-in-out"
					pointerEvents="none"
				>
					<Text
						color="#4A7C2F"
						fontWeight="600"
						fontSize="sm"
						fontFamily="'Inter', sans-serif"
					>
						✓ Saved to Pantry
					</Text>
				</Box>
			)}
		</Box>
	);
}
