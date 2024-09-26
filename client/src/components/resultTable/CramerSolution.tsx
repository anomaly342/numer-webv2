import { CramerResult } from "@/utilities/types";
import Latex from "react-latex-next";

const arrayToLatexMatrix = (arr: number[][], matrixType: string): string => {
	const size = arr.length;
	let str = `\\begin{${matrixType}}`;

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (j === size - 1) {
				str += `${arr[i][j]}`;
			} else {
				str += `${arr[i][j]} &`;
			}
		}
		if (i !== size - 1) {
			str += "\\\\";
		}
	}

	str += `\\end{${matrixType}}`;

	return str;
};

export default function CramerSolution({ data }: { data: CramerResult }) {
	const detA = data?.detA;
	return (
		<div className="bg-white w-full shadow-md rounded-md flex flex-col">
			<div
				id="Latex"
				className="flex flex-col py-6 px-8 border-l-2 border-l-orange-500"
			>
				<h5 className="font-bold mb-8 text-lg bg-orange-500 w-fit text-white px-2">
					Answer
				</h5>
				<div className="flex flex-col mx-auto">
					{data.value.map((e, i) => (
						<Latex key={i}>{`$x_${i + 1}=${e.toString()}$`}</Latex>
					))}
				</div>
			</div>

			<div className="flex flex-col mt-10 py-6 px-8 border-l-2 border-l-orange-500">
				<h5 className="font-bold mb-8 text-lg bg-orange-500 w-fit text-white px-2">
					Solution
				</h5>
				<Latex>{`$\\det(A) = ${detA}$`}</Latex>
				<div className="flex flex-col mx-auto mt-5 gap-7">
					{data.matrixA_i.map((e, i) => {
						const matrixString = arrayToLatexMatrix(e, "vmatrix");
						return (
							<Latex key={i}>{`$x_${i + 1} = \\frac{\\det(A_${
								i + 1
							})}{\\det(A)} = \\frac{${matrixString}}{${detA}} = \\frac{${
								data.detA_i[i]
							}}{${detA}} = ${data.value[i]}$`}</Latex>
						);
					})}
				</div>
			</div>
		</div>
	);
}
