import { useEffect, useState } from "react";
import {
	Box,
	Heading,
	Button,
	VStack,
	Divider,
	Text,
	HStack,
	Collapse,
} from "@chakra-ui/react";
import { type Page, type PantryPage } from "../types";
import {
	getSavedRecipes,
	deleteSavedRecipe,
	type SavedRecipe,
} from "../storage";

export default function SavedRecipes({
	setCurrentPage,
}: {
	setCurrentPage: React.Dispatch<React.SetStateAction<Page | PantryPage>>;
}) {
	const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
	const [expanded, setExpanded] = useState<number | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

	useEffect(() => {
		getSavedRecipes().then(setRecipes);
	}, []);

	async function handleDelete(index: number) {
		await deleteSavedRecipe(index);
		setRecipes(await getSavedRecipes());
		setConfirmDelete(null);
	}

	return (
		<Box
			p={6}
			bg="#F7F3EC"
			w="430px"
			h="560px"
			display="flex"
			flexDirection="column"
			overflow="hidden"
		>
			<VStack
				align="start"
				gap={1}
				mb={4}
				flexShrink={0}
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
					Saved Recipes
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>
			</VStack>

			{/* scrollable list */}
			<Box
				flex={1}
				overflowY="auto"
				css={{
					"&::-webkit-scrollbar": { width: "4px" },
					"&::-webkit-scrollbar-thumb": {
						background: "#C8D8B8",
						borderRadius: "4px",
					},
				}}
			>
				{recipes.length === 0 && (
					<Text
						color="gray.400"
						fontSize="sm"
						fontFamily="'Inter', sans-serif"
						mt={2}
					>
						No saved recipes yet.
					</Text>
				)}

				<VStack
					align="stretch"
					gap={2}
				>
					{recipes.map((r, i) => (
						<Box
							key={i}
							bg="white"
							borderRadius="xl"
							border="1.5px solid"
							borderColor="#C8D8B8"
							overflow="hidden"
						>
							{/* recipe header — clickable to expand */}
							<HStack
								justify="space-between"
								p={3}
								cursor="pointer"
								onClick={() => setExpanded(expanded === i ? null : i)}
								_hover={{ bg: "#F0F7E8" }}
							>
								<Text
									fontFamily="'Inter', sans-serif"
									fontWeight="600"
									fontSize="sm"
									color="#1E3A0F"
								>
									{r.recipeType}
								</Text>
								<Text
									fontSize="xs"
									color="#7A8F6A"
								>
									{expanded === i ? "▲" : "▼"}
								</Text>
							</HStack>

							{/* expanded content */}
							<Collapse in={expanded === i}>
								<Box
									p={3}
									borderTop="1px solid"
									borderColor="#E8EFE0"
								>
									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										fontWeight="600"
										color="#4A7C2F"
										mb={2}
									>
										<a
											href={r.link}
											target="_blank"
											rel="noreferrer"
										>
											View Full Recipe →
										</a>
									</Text>

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
										mb={2}
									>
										{r.ingredients}
									</Text>

									<Text
										fontFamily="'Playfair Display', serif"
										fontSize="sm"
										fontWeight="700"
										color="#1E3A0F"
									>
										Instructions
									</Text>
									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										color="#4A5240"
										mt={1}
										mb={2}
									>
										{r.instructions}
									</Text>

									<Text
										fontFamily="'Playfair Display', serif"
										fontSize="sm"
										fontWeight="700"
										color="#1E3A0F"
									>
										Appliances
									</Text>
									<Text
										fontFamily="'Inter', sans-serif"
										fontSize="xs"
										color="#4A5240"
										mt={1}
										mb={3}
									>
										{r.appliances}
									</Text>

									{/* delete button */}
									{confirmDelete === i ? (
										<Box
											bg="#FFF5F5"
											border="1px solid"
											borderColor="#FEB2B2"
											borderRadius="lg"
											p={3}
										>
											<Text
												fontSize="xs"
												fontFamily="'Inter', sans-serif"
												color="#C53030"
												mb={2}
											>
												Are you sure you want to delete this recipe?
											</Text>
											<HStack>
												<Button
													size="xs"
													bg="#C53030"
													color="white"
													borderRadius="lg"
													_hover={{ bg: "#9B2C2C" }}
													onClick={() => handleDelete(i)}
												>
													Delete
												</Button>
												<Button
													size="xs"
													variant="ghost"
													color="#7A8F6A"
													_hover={{ color: "#2D5016" }}
													onClick={() => setConfirmDelete(null)}
												>
													Cancel
												</Button>
											</HStack>
										</Box>
									) : (
										<Button
											size="xs"
											variant="ghost"
											color="#C08080"
											fontFamily="'Inter', sans-serif"
											_hover={{ color: "#C53030", bg: "transparent" }}
											onClick={() => setConfirmDelete(i)}
										>
											Delete Recipe
										</Button>
									)}
								</Box>
							</Collapse>
						</Box>
					))}
				</VStack>
			</Box>
		</Box>
	);
}
