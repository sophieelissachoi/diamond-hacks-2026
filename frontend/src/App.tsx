import { useState } from "react";
import { Heading, Button, Grid, GridItem, VStack } from "@chakra-ui/react";
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
			h="300px"
			display="flex"
			justifyContent="center"
			alignItems="center"
		>
			<Heading> Mise </Heading>

			{/* ---- home page nav Buttons ---- */}
			<Grid
				templateColumns="repeat(2, 1fr)"
				gap={2}
			>
				{pages.map((p) => (
					<GridItem key={p}>
						<Button
							w="100px"
							h="100px"
							whiteSpace="normal"
							wordBreak="break-word"
							onClick={() => setCurrentPage(p)}
						>
							{p}
						</Button>
					</GridItem>
				))}
			</Grid>
		</VStack>
	);
}

export default App;
