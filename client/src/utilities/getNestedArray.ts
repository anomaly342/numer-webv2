export const getNestedArray = (size: number, fill: number | string) => {
	console.log(size);
	// Create a new array with 'size' number of rows
	return Array.from({ length: size }, () => Array(size).fill(fill));
};
