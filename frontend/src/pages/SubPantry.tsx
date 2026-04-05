import { Heading } from "@chakra-ui/react";
import { type Ingredient } from "../types";

interface SubPantryInterfaces {
	category: string;
}

const SubPantry = ({ category }: SubPantryInterfaces) => {
	return <Heading>{category}</Heading>;
};

export default SubPantry;
