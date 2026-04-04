import { useState } from "react";
import { Heading, Button, Input, Box } from "@chakra-ui/react";

interface Props {
	onDone: (ingredients: string[]) => void;
}

export default function UploadReceipt({ onDone }: Props) {
	const [file, setFile] = useState<File | null>(null);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	}

	async function handleUpload() {
		if (!file) return;
		// LLM logic goes here
		const ingredients: string[] = []; // replace with real result
		onDone(ingredients);
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
				isDisabled={!file}
			>
				Upload & Scan
			</Button>
		</Box>
	);
}
