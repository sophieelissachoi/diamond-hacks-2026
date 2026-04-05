import { useState } from "react";
import {
	Heading,
	Button,
	Grid,
	GridItem,
	VStack,
	Text,
	Divider,
} from "@chakra-ui/react";
import { type Page, type PantryPage } from "./types";
import "./App.css";

import SearchRecipe from "./pages/Search";
import SavedRecipes from "./pages/Saved";
import ScanRecipes from "./pages/Scan";
import Pantry from "./pages/Pantry";
import { FaSearch, FaRegSave, FaExpand, FaFolder } from "react-icons/fa";

function App() {
	const [currentPage, setCurrentPage] = useState<Page | PantryPage>("home");
	const pages: Page[] = [
		"Search Recipe",
		"Saved Recipes",
		"Scan Recipe",
		"Pantry",
	];

	const icons = [<FaSearch />, <FaRegSave />, <FaExpand />, <FaFolder />];

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
			minH="500px"
			justifyContent="center"
			alignItems="center"
			bg="#F7F3EC"
			p={8}
			gap={6}
		>
			{/* header */}
			<VStack gap={1}>
				<Heading
					fontFamily="'Playfair Display', serif"
					fontSize="4xl"
					fontWeight="700"
					color="#1E3A0F"
					letterSpacing="0.15em"
				>
					mise
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>
				<Text
					fontFamily="'Inter', sans-serif"
					fontSize="xs"
					color="#7A8F6A"
					letterSpacing="0.2em"
					textTransform="uppercase"
				>
					your kitchen assistant
				</Text>
			</VStack>

			{/* nav grid */}
			<Grid
				templateColumns="repeat(2, 1fr)"
				gap={3}
				w="100%"
			>
				{pages.map((p, i) => (
					<GridItem key={p}>
						<Button
							w="100%"
							h="100px"
							whiteSpace="normal"
							wordBreak="break-word"
							onClick={() => setCurrentPage(p)}
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
						>
							<VStack>
								<Text>{p}</Text>
								<Text>{icons[i]}</Text>
							</VStack>
						</Button>
					</GridItem>
				))}
			</Grid>
		</VStack>
	);
}

export default App;
