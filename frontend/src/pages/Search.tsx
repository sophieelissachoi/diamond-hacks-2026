import { Box, Heading } from "@chakra-ui/react";

export default function SearchRecipe() {
	return (
		<Box p={6}>
			<Heading size="lg">Find a recipe</Heading>

			<Box
				as="form"
				mt={4}
			>
				{/* we’ll add inputs later */}
			</Box>
		</Box>
	);
}
