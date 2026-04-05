import { useState } from "react";
import {
	Box,
	Heading,
	Button,
	Input,
	Text,
	VStack,
	Divider,
} from "@chakra-ui/react";
import { type Page, type PantryPage } from "../types";
import { saveFindRecipe } from "../storage";

interface Recipe {
	link: string;
	ingredients: string;
	instructions: string;
	appliances: string;
}

export default function SearchRecipe({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	const [recipeType, setRecipeType] = useState("");
	const [result, setResult] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [saved, setSaved] = useState(false);

	async function handleSearch() {
		if (!recipeType.trim()) return;
		setLoading(true);
		setError("");

		try {
			const res = await fetch("http://localhost:3001/find-recipe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ recipeType }),
			});
			const { jobId } = await res.json();

			const interval = setInterval(async () => {
				const poll = await fetch(`http://localhost:3001/find-recipe/${jobId}`);
				const data = await poll.json();

				if (data.status === "done") {
					clearInterval(interval);
					try {
						setResult(data.output);
					} catch {
						setError("Could not parse recipe. Try again.");
					}
					setLoading(false);
				}
			}, 3000);
		} catch {
			setError("Request failed");
			setLoading(false);
		}
	}

	async function handleSave() {
		if (!result) return;
		await saveFindRecipe({ ...result, recipeType });
		setSaved(true);
		setTimeout(() => {
			setSaved(false);
			setResult(null); // clear the result
			setRecipeType(""); // clear the search input
		}, 1000);
	}

	return (
		<Box
			bg="#F7F3EC"
			w="300px"
			h="500px"
			display="flex"
			flexDirection="column"
			overflow="hidden"
		>
			{/* fixed top — header + search */}
			<Box
				p={6}
				pb={3}
				flexShrink={0}
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
						Find a Recipe
					</Heading>
					<Divider
						borderColor="#A8C090"
						w="40px"
						borderWidth="1.5px"
					/>
				</VStack>

				<VStack
					align="stretch"
					gap={3}
				>
					<Input
						placeholder="e.g. pasta, soup, stir fry..."
						value={recipeType}
						onChange={(e) => setRecipeType(e.target.value)}
						bg="white"
						border="1.5px solid"
						borderColor="#C8D8B8"
						borderRadius="xl"
						fontFamily="'Inter', sans-serif"
						fontSize="sm"
						_focus={{ borderColor: "#4A7C2F", boxShadow: "none" }}
						_placeholder={{ color: "#B0BEA4" }}
					/>
					<Button
						onClick={handleSearch}
						isDisabled={!recipeType.trim() || loading}
						bg="#4A7C2F"
						color="white"
						borderRadius="xl"
						fontFamily="'Inter', sans-serif"
						fontSize="sm"
						fontWeight="500"
						_hover={{
							bg: "white",
							color: "#2D5016",
							border: "1.5px solid",
							borderColor: "#C8D8B8",
						}}
						_active={{ bg: "#2D5016", color: "white" }}
						transition="all 0.2s"
					>
						{loading ? "Searching..." : "Find Recipe"}
					</Button>
				</VStack>

				{error && (
					<Text
						mt={3}
						color="red.400"
						fontSize="sm"
						fontFamily="'Inter', sans-serif"
					>
						{error}
					</Text>
				)}
			</Box>

			{/* scrollable results */}
			{result && (
				<>
					<Box
						flex={1}
						overflowY="auto"
						px={6}
						pb={2}
						css={{
							"&::-webkit-scrollbar": { width: "4px" },
							"&::-webkit-scrollbar-track": { background: "transparent" },
							"&::-webkit-scrollbar-thumb": {
								background: "#C8D8B8",
								borderRadius: "4px",
							},
						}}
					>
						<Box
							bg="white"
							borderRadius="2xl"
							border="1.5px solid"
							borderColor="#C8D8B8"
							p={4}
						>
							<Text
								fontFamily="'Inter', sans-serif"
								fontSize="sm"
								fontWeight="600"
								color="#4A7C2F"
								mb={3}
							>
								<a
									href={result.link}
									target="_blank"
									rel="noreferrer"
								>
									View Full Recipe →
								</a>
							</Text>

							<Divider
								borderColor="#E8EFE0"
								mb={3}
							/>

							<Text
								fontFamily="'Playfair Display', serif"
								fontSize="sm"
								fontWeight="700"
								color="#1E3A0F"
							>
								Ingredients
							</Text>
							<Text
								fontFamily="'Inter', sans-serif"
								fontSize="xs"
								color="#4A5240"
								mt={1}
							>
								{result.ingredients}
							</Text>

							<Text
								fontFamily="'Playfair Display', serif"
								fontSize="sm"
								fontWeight="700"
								color="#1E3A0F"
								mt={3}
							>
								Instructions
							</Text>
							<Text
								fontFamily="'Inter', sans-serif"
								fontSize="xs"
								color="#4A5240"
								mt={1}
							>
								{result.instructions}
							</Text>

							<Text
								fontFamily="'Playfair Display', serif"
								fontSize="sm"
								fontWeight="700"
								color="#1E3A0F"
								mt={3}
							>
								Appliances
							</Text>
							<Text
								fontFamily="'Inter', sans-serif"
								fontSize="xs"
								color="#4A5240"
								mt={1}
							>
								{result.appliances}
							</Text>
						</Box>
					</Box>

					{/* fixed save button at bottom */}
					<Box
						p={4}
						bg="#F7F3EC"
						borderTop="1px solid"
						borderColor="#E8EFE0"
						flexShrink={0}
					>
						<Button
							w="100%"
							onClick={handleSave}
							isDisabled={saved}
							bg={saved ? "white" : "#4A7C2F"}
							color={saved ? "#4A7C2F" : "white"}
							border="1.5px solid"
							borderColor="#4A7C2F"
							borderRadius="xl"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							fontWeight="500"
							_hover={{ bg: "white", color: "#2D5016" }}
							transition="all 0.2s"
						>
							{saved ? "Saved ✓" : "Save Recipe"}
						</Button>
						<Button
							mt={2}
							w="100%"
							variant="ghost"
							color="#7A8F6A"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							_hover={{ color: "#2D5016", bg: "transparent" }}
							onClick={() => {
								setResult(null);
								setRecipeType("");
							}}
						>
							Cancel
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
}
