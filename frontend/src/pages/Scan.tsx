import { Box, Heading, Button } from "@chakra-ui/react";
import { type Page, type PantryPage } from "../types";

export default function ScanRecipes({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	return (
		<Box p={6}>
			<Button onClick={() => setCurrentPage("home")}>← Back</Button>
			<Heading size="lg">Scan Recipe</Heading>

			<Box
				as="form"
				mt={4}
			>
				{/* we’ll add inputs later */}
			</Box>
		</Box>
	);
}
