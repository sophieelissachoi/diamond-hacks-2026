import { useEffect, useState } from "react";
import { Heading, Button } from "@chakra-ui/react";
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

	const pantryPage: PantryPage[] = [
		"subpantry",
		"upload-receipt",
		"take-picture",
		"edit-confirmation",
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
		<>
			<Heading> Mise </Heading>

			{/* ---- home page nav Buttons ---- */}
			<div
				style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}
			>
				{pages.map((p) => (
					<Button onClick={() => setCurrentPage(p)}>{p}</Button>
				))}
			</div>
		</>
	);
}

export default App;
