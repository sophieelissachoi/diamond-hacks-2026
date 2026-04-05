import { useState } from "react";
import {
	Heading,
	Button,
	Input,
	Box,
	Spinner,
	Text,
	VStack,
	Divider,
} from "@chakra-ui/react";
import { type PantryPage, type RawIngredients } from "../types";

interface Props {
	setCurrentPagePantry: React.Dispatch<React.SetStateAction<PantryPage>>;
	onDone: (ingredients: RawIngredients) => void;
}

export default function UploadReceipt({ setCurrentPagePantry, onDone }: Props) {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	}

	async function handleUpload() {
		if (!file) return;
		setLoading(true);
		try {
			const base64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});

			const res = await fetch("http://localhost:3001/scan-picture", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					picture: base64,
					fileName: file.name,
					contentType: file.type,
				}),
			});

			const data = await res.json();
			const parsed = data.output;
			onDone(parsed);
		} finally {
			setLoading(false);
		}
	}

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
					onClick={() => setCurrentPagePantry("pantry")}
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
					Upload Receipt
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>

				<Input
					type="file"
					accept="image/png, image/jpeg"
					onChange={handleFileChange}
					mt={3}
					fontFamily="'Inter', sans-serif"
					fontSize="sm"
					color="#1E3A0F"
					border="1px solid #A8C090"
					pt={1.5}
					pb={2}
					_hover={{ borderColor: "#2D5016" }}
				/>

				{file && (
					<Text
						mt={2}
						fontSize="sm"
						fontFamily="'Inter', sans-serif"
						color="#7A8F6A"
					>
						Selected file: {file.name}
					</Text>
				)}

				<Button
					onClick={handleUpload}
					mt={3}
					isDisabled={!file || loading}
					bg="#4A7C2F"
					color="white"
					border="1.5px solid"
					borderColor="#4A7C2F"
					borderRadius="2xl"
					fontFamily="'Inter', sans-serif"
					fontSize="sm"
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
				>
					{loading ? "Scanning..." : "Upload & Scan"}
				</Button>

				{loading && (
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
							Analyzing your receipt...
						</Text>
					</Box>
				)}
			</VStack>
		</Box>
	);
}
