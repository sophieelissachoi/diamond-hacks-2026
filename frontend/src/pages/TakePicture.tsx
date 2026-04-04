import { Box, Heading } from "@chakra-ui/react";

export default function TakePicture() {
	return (
		<Box p={6}>
			<Heading size="lg">Take a picture of your reciept</Heading>

			<Box
				as="form"
				mt={4}
			>
				{/* we’ll add inputs later */}
			</Box>
		</Box>
	);
}
