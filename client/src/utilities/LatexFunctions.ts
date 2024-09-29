export const toFixedIfNecessary = (value: number) => {
	return +value.toFixed(5);
};

export const getLatexMatrix = (arr: number[][], matrixType: string): string => {
	const size = arr.length;
	let str = `\\begin{${matrixType}}`;

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (j === size - 1) {
				str += `${toFixedIfNecessary(arr[i][j])}`;
			} else {
				str += `${toFixedIfNecessary(arr[i][j])} &`;
			}
		}
		if (i !== size - 1) {
			str += "\\\\";
		}
	}

	str += `\\end{${matrixType}}`;

	return str;
};
