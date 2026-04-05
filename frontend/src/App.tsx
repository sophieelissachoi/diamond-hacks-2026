import { useState } from "react";
import {
	Heading,
	Button,
	Grid,
	GridItem,
	VStack,
	Text,
} from "@chakra-ui/react";
import { type Page, type PantryPage } from "./types";

import SearchRecipe from "./pages/Search";
import SavedRecipes from "./pages/Saved";
import ScanRecipes from "./pages/Scan";
import Pantry from "./pages/Pantry";

function App() {
	//navigation state
	const [currentPage, setCurrentPage] = useState<Page | PantryPage>("home");
	const pages: Page[] = [
		"Search Recipe",
		"Saved Recipes",
		"Scan Recipe",
		"Pantry",
	];

	if (currentPage !== "home") {
		return (
			<>
				{currentPage === "Search Recipe" && (
					<SearchRecipe setCurrentPage={setCurrentPage} />
				)}
				{currentPage === "Saved Recipes" && (
					<SavedRecipes setCurrentPage={setCurrentPage} />
				)}
				{currentPage === "Scan Recipe" && (
					<ScanRecipes setCurrentPage={setCurrentPage} />
				)}
				{currentPage === "Pantry" && <Pantry setCurrentPage={setCurrentPage} />}
			</>
		);
	}

	return (
		<VStack
			w="300px"
			h="500px"
			display="flex"
			justifyContent="center"
			alignItems="center"
			bg="#F5F0E8"
			p={6}
			gap={4}
		>
			<VStack gap={0}>
				<Heading
					fontSize="3xl"
					fontWeight="800"
					color="#2D5016"
					letterSpacing="wider"
				>
					MISE
				</Heading>
				<Text sx={{ fontSize: "sm", color: "#6B7C5C" }}>
					your kitchen assistant
				</Text>
			</VStack>

			<Grid
				templateColumns="repeat(2, 1fr)"
				gap={3}
				mt={2}
			>
				{pages.map((p) => (
					<GridItem key={p}>
						<Button
							w="110px"
							h="110px"
							whiteSpace="normal"
							wordBreak="break-word"
							onClick={() => setCurrentPage(p)}
							bg="#4A7C2F"
							color="white"
							borderRadius="xl"
							fontSize="sm"
							fontWeight="600"
							_hover={{ bg: "#3A6B20", transform: "scale(1.03)" }}
							_active={{ bg: "#2D5016" }}
							transition="all 0.15s"
							boxShadow="md"
						>
							{p === "Search Recipe" && "Search Recipe"}
							{p === "Saved Recipes" && "Saved Recipes"}
							{p === "Scan Recipe" && "Scan Recipe"}
							{p === "Pantry" && "Pantry"}
						</Button>
					</GridItem>
				))}
			</Grid>
		</VStack>
	);
}

export default App;
