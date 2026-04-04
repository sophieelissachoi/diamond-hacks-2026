import { Box, Heading } from "@chakra-ui/react";

export default function SavedRecipes() {
	return (
		<Box p={6}>
			<Heading size="lg">Your saved recipes</Heading>

			<Box
				as="form"
				mt={4}
			>
				{/* we’ll add inputs later */}
			</Box>
		</Box>
	);
}
