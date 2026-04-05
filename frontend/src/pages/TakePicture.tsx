import { useState, useRef, useEffect } from "react";
import {
	Heading,
	Button,
	Box,
	Text,
	VStack,
	Divider,
	HStack,
	Image,
} from "@chakra-ui/react";
import { type PantryPage, type RawIngredients } from "../types";

interface Props {
	setCurrentPagePantry: React.Dispatch<React.SetStateAction<PantryPage>>;
	onDone: (ingredients: RawIngredients) => void;
}

export default function TakePicture({ setCurrentPagePantry, onDone }: Props) {
	const [photo, setPhoto] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [streaming, setStreaming] = useState(false);

	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
				setStreaming(true);
			}
		} catch {
			setError("Could not access camera.");
		}
	}

	useEffect(() => {
		let cancelled = false;
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (cancelled) return;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.play();
					setStreaming(true);
				}
			})
			.catch(() => {
				if (!cancelled) setError("Could not access camera.");
			});

		return () => {
			cancelled = true;
		};
	}, []);

	function capturePhoto() {
		if (!videoRef.current || !canvasRef.current) return;
		const canvas = canvasRef.current;
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
		const dataUrl = canvas.toDataURL("image/jpeg");
		setPhoto(dataUrl);
		setStreaming(false);

		// stop camera
		const stream = videoRef.current.srcObject as MediaStream;
		stream?.getTracks().forEach((t) => t.stop());
	}

	function retake() {
		setPhoto(null);
		setError("");
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.play();
					setStreaming(true);
				}
			})
			.catch(() => {
				setError("Could not access camera.");
			});
	}

	async function handleScan() {
		if (!photo) return;
		setLoading(true);
		setError("");

		try {
			const res = await fetch("http://localhost:3001/scan-picture", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					picture: photo,
					fileName: "capture.jpg",
					contentType: "image/jpeg",
				}),
			});

			const data = await res.json();
			console.log("Server response:", data);

			if (!res.ok || !data.output) {
				setError("Failed to scan. Try again.");
				setLoading(false);
				return;
			}

			const parsed = data.output;
			const ingredients: RawIngredients = {
				name: parsed.name,
				category: parsed.category,
				food: parsed.food,
				quantity: parsed.quantity,
			};

			onDone(ingredients);
		} catch {
			setError("Request failed.");
			setLoading(false);
		}
	}

	return (
		<Box
			bg="#F7F3EC"
			w="430px"
			minH="560px"
			p={6}
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
					Take Picture
				</Heading>
				<Divider
					borderColor="#A8C090"
					w="40px"
					borderWidth="1.5px"
				/>
			</VStack>

			{error && (
				<Text
					color="red.400"
					fontSize="sm"
					fontFamily="'Inter', sans-serif"
					mb={3}
				>
					{error}
				</Text>
			)}

			{/* camera view */}
			{!photo && (
				<VStack gap={3}>
					<Box
						w="100%"
						h="220px"
						bg="white"
						borderRadius="xl"
						border="1.5px solid"
						borderColor="#C8D8B8"
						overflow="hidden"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						<video
							ref={videoRef}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: streaming ? "block" : "none",
								transform: "scaleX(-1)",
							}}
							autoPlay
							playsInline
						/>
						{!streaming && (
							<Text
								color="#B0BEA4"
								fontSize="sm"
								fontFamily="'Inter', sans-serif"
							>
								Camera preview
							</Text>
						)}
					</Box>
					<canvas
						ref={canvasRef}
						style={{ display: "none" }}
					/>

					{!streaming ? (
						<Button
							w="100%"
							onClick={startCamera}
							bg="#4A7C2F"
							color="white"
							borderRadius="xl"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							_hover={{
								bg: "white",
								color: "#2D5016",
								border: "1.5px solid",
								borderColor: "#C8D8B8",
							}}
							transition="all 0.2s"
						>
							Open Camera
						</Button>
					) : (
						<Button
							w="100%"
							onClick={capturePhoto}
							bg="#4A7C2F"
							color="white"
							borderRadius="xl"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							_hover={{
								bg: "white",
								color: "#2D5016",
								border: "1.5px solid",
								borderColor: "#C8D8B8",
							}}
							transition="all 0.2s"
						>
							Capture
						</Button>
					)}
				</VStack>
			)}

			{/* photo confirmation */}
			{photo && (
				<VStack gap={3}>
					<Image
						src={photo}
						borderRadius="xl"
						border="1.5px solid"
						borderColor="#C8D8B8"
						w="100%"
					/>
					<HStack w="100%">
						<Button
							flex={1}
							variant="ghost"
							color="#7A8F6A"
							border="1.5px solid"
							borderColor="#C8D8B8"
							borderRadius="xl"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							onClick={retake}
						>
							Retake
						</Button>
						<Button
							flex={1}
							onClick={handleScan}
							isDisabled={loading}
							bg="#4A7C2F"
							color="white"
							borderRadius="xl"
							fontFamily="'Inter', sans-serif"
							fontSize="sm"
							_hover={{
								bg: "white",
								color: "#2D5016",
								border: "1.5px solid",
								borderColor: "#C8D8B8",
							}}
							transition="all 0.2s"
						>
							{loading ? "Scanning..." : "Scan Ingredients"}
						</Button>
					</HStack>
				</VStack>
			)}
		</Box>
	);
}
