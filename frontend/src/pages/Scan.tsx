import { useState, useEffect } from "react";
import {
	Box,
	Heading,
	Button,
	VStack,
	Divider,
	Spinner,
	Text,
} from "@chakra-ui/react";
import {
	type Page,
	type PantryPage,
	type RecipeInfo,
	type Ingredient,
} from "../types";
import { saveFindRecipe } from "../storage";

export default function ScanRecipes({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	const [url, setUrl] = useState<string | undefined>("");
	const [recipeInfo, setRecipeInfo] = useState<RecipeInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [saved, setSaved] = useState(false);
	const [recipeType, setRecipeType] = useState("");
	const [pantry, setPantry] = useState<Ingredient[]>([]);

	useEffect(() => {
		chrome.storage.local.get(["pantry"], (result) => {
			const items: Ingredient[] = Array.isArray(result.pantry)
				? result.pantry
				: [];
			setPantry(items);
		});

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			setUrl(tabs[0].url);
		});
	}, []);

	async function handleSave() {
		if (!recipeInfo) return;
		await saveFindRecipe({
			link: recipeInfo.link,
			ingredients: Array.isArray(recipeInfo.ingredients)
				? recipeInfo.ingredients.join(", ")
				: recipeInfo.ingredients,
			instructions: recipeInfo.instructions,
			appliances: Array.isArray(recipeInfo.appliances)
				? recipeInfo.appliances.join(", ")
				: recipeInfo.appliances,
			recipeType,
		});
		setSaved(true);
		setTimeout(() => {
			setSaved(false);
			setRecipeInfo(null);
			setRecipeType("");
		}, 1000);
	}

	const scanRecipe = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("http://localhost:3001/find-ingredients", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url, pantry }),
			});
			const data = await res.json();
			setRecipeInfo(data.output);
			setRecipeType(url ?? "Scanned Recipe");

			chrome.runtime.sendMessage({
				type: "HIGHLIGHT_INGREDIENTS",
				have: data.output.have ?? [],
				need: data.output.need ?? [],
				substitute:
					typeof data.output.substitute === "string" ? data.output.substitute : "",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box
			p={6}
			bg="#F7F3EC"
			w="500px"
			h="500px"
			display="flex"
			flexDirection="column"
			overflow="scroll"
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
					mt={2}
					w="100%"
				>
					<Button
						mt={2}
						py={6}
						w="100%"
						whiteSpace="normal"
						wordBreak="break-word"
						bg="#4A7C2F"
						color="white"
						border="1.5px solid"
						borderColor="#4A7C2F"
						borderRadius="2xl"
						fontFamily="'Inter', sans-serif"
						fontSize="md"
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
						onClick={scanRecipe}
					>
						Scan Recipe
					</Button>

					{isLoading && (
						<Box
							mt={4}
							display="flex"
							alignItems="center"
							gap={2}
						>
							<Spinner
								size="sm"
								color="#4A7C2F"
							/>
							<Text
								fontSize="sm"
								fontFamily="'Inter', sans-serif"
								color="#7A8F6A"
							>
								Analyzing the recipe...
							</Text>
						</Box>
					)}

					{recipeInfo && !isLoading && (
						<>
							<Box
								flex={1}
								overflowY="auto"
								mt={4}
								mb={2}
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
										fontFamily="'Playfair Display', serif"
										fontSize="sm"
										fontWeight="700"
										color="#1E3A0F"
									>
										Have:
									</Text>

									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										color="#4A5240"
										mt={1}
									>
										{Array.isArray(recipeInfo.have)
											? recipeInfo.have.join(", ")
											: recipeInfo.have}
									</Text>

									<Text
										fontFamily="'Playfair Display', serif"
										fontSize="sm"
										fontWeight="700"
										color="#1E3A0F"
									>
										Need:
									</Text>

									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										color="#4A5240"
										mt={1}
									>
										{Array.isArray(recipeInfo.need)
											? recipeInfo.need.join(", ")
											: recipeInfo.need}
									</Text>

									<Text
										fontFamily="'Playfair Display', serif"
										fontSize="sm"
										fontWeight="700"
										color="#1E3A0F"
									>
										Substitute:
									</Text>

									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										color="#4A5240"
										mt={1}
									>
										{Array.isArray(recipeInfo.substitute)
											? recipeInfo.substitute.join(", ")
											: recipeInfo.substitute}
									</Text>
								</Box>

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
											href={recipeInfo.link}
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
										{Array.isArray(recipeInfo.ingredients)
											? recipeInfo.ingredients.join(", ")
											: recipeInfo.ingredients}
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
										{Array.isArray(recipeInfo.instructions)
											? recipeInfo.instructions.join(", ")
											: recipeInfo.instructions}
									</Text>

									<Text
										fontFamily="'Playfair Display', serif"
										fontSize="sm"
										fontWeight="700"
										color="#1E3A0F"
										mt={3}
									>
										Applicances
									</Text>
									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										color="#4A5240"
										mt={1}
									>
										{Array.isArray(recipeInfo.appliances)
											? recipeInfo.appliances.join(", ")
											: recipeInfo.appliances}
									</Text>
								</Box>
							</Box>

							<Box
								mt={4}
								bg="#F7F3EC"
								borderTop="1px solid"
								borderColor="#E8EFE0"
								pt={4}
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
									w="100%"
									variant="ghost"
									color="#7A8F6A"
									fontFamily="'Inter', sans-serif"
									fontSize="sm"
									_hover={{ color: "#2D5016", bg: "transparent" }}
									onClick={() => {
										setRecipeInfo(null);
										setRecipeType("");
									}}
								>
									Cancel
								</Button>
							</Box>
						</>
					)}
				</Box>
			</VStack>
		</Box>
	);
}
