import { Box, Heading, Button, VStack, Divider } from "@chakra-ui/react";
import { type Page, type PantryPage } from "../types";

export default function ScanRecipes({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	return (
		<Box
			p={6}
			bg="#F7F3EC"
			w="500px"
			h="500px"
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
					Scan Recipe
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>

				<Box
					as="form"
					mt={4}
				>
					{/* we'll add inputs later */}
				</Box>
			</VStack>
		</Box>
	);
}
