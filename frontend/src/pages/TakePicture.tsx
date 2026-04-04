import { Heading, Button } from "@chakra-ui/react";

interface Props {
	onDone: (ingredients: string[]) => void;
}

export default function TakePicture({ onDone }: Props) {
	async function handleCapture() {
		// LLM logic goes here
		const ingredients: string[] = []; // replace with real result
		onDone(ingredients);
	}

	return (
		<>
			<Heading size="md">Take Picture</Heading>
			<Button onClick={handleCapture}>Capture & Scan</Button>
		</>
	);
}
