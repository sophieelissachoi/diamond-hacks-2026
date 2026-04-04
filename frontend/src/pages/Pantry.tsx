import { Box, Heading } from "@chakra-ui/react";

export default function Pantry() {
	return (
		<Box p={6}>
			<Heading size="lg">Your Pantry</Heading>

			<Box
				as="form"
				mt={4}
			>
				{/* we’ll add inputs later */}
			</Box>
		</Box>
	);
}
