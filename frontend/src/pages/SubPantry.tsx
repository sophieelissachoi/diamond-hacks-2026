interface SubPantryInterfaces {
	category: string;
}

const SubPantry = ({ category }: SubPantryInterfaces) => {
	return <div>{category}</div>;
};

export default SubPantry;
