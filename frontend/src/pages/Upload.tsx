import { useState } from "react";
import { Heading, Button, Input, Box, Spinner, Text } from "@chakra-ui/react";
import { type Ingredient } from "../types";

interface Props {
	onDone: (ingredients: Ingredient[]) => void;
}

export default function UploadReceipt({ onDone }: Props) {
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
		<Box>
			<Heading size="md">Upload Receipt</Heading>

			<Input
				type="file"
				accept="image/png, image/jpeg"
				onChange={handleFileChange}
				mt={3}
			/>

			{file && (
				<Box
					mt={2}
					fontSize="sm"
				>
					Selected file: {file.name}
				</Box>
			)}

			<Button
				onClick={handleUpload}
				mt={3}
				isDisabled={!file || loading}
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
					<Spinner size="sm" />
					<Text fontSize="sm">Analyzing your receipt...</Text>
				</Box>
			)}
		</Box>
	);
}
