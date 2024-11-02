import Latex from "react-latex-next";
import React from "react";
import { toFixedIfNecessary } from "@/utilities/LatexFunctions";
import { ExtrapolationResult } from "@/types/extrapolation/results";
import { getLatexMatrix } from "@/utilities/LatexFunctions";
const generateSimpleRegressionLatex = (data: ExtrapolationResult) => {
	const { a, matrixA, matrixB, value, m, requestX } = data;

	let latex = "$\\begin{aligned}";
	latex += "f(x) &= ";

	for (let i = 0; i <= m; i++) {
		if (i == 0) {
			latex += `a_${i}`;
		} else if (i == 1) {
			latex += `+ a_${i}x`;
		} else {
			latex += `+ a_${i}x^${i}`;
		}
	}
	latex += "\\\\[12px] &";
	latex += getLatexMatrix(matrixA, "bmatrix");

	latex += `\\begin{Bmatrix}`;
	for (let i = 0; i < a.length; i++) {
		latex += `a_${i} \\\\`;
	}

	latex += `\\end{Bmatrix}`;

	latex += `=\\begin{Bmatrix}`;
	for (let i = 0; i < a.length; i++) {
		latex += `${matrixB[i]} \\\\`;
	}

	latex += `\\end{Bmatrix} \\\\[12px]`;

	for (let i = 0; i < a.length; i++) {
		latex += `a_${i} &= ${toFixedIfNecessary(a[i])} \\\\`;
	}

	latex += `[8px]`;
	latex += `f(${requestX}) &= `;

	for (let i = 0; i <= m; i++) {
		if (i == 0) {
			latex += `a_${i}`;
		} else if (i == 1) {
			latex += `+ a_${i}x`;
		} else {
			latex += `+ a_${i}x^${i}`;
		}
	}

	latex += `\\\\ &=${toFixedIfNecessary(value)}`;
	latex += `\\end{aligned}$`;

	return latex;
};

function SimpleRegressionSolution({ data }: { data: ExtrapolationResult }) {
	const latex_string = generateSimpleRegressionLatex(data);
	return (
		<div className="bg-white w-full shadow-md rounded-md flex flex-col overflow-x-auto">
			<div
				id="Latex"
				className="flex flex-col py-6 px-8 border-l-2 border-l-orange-500"
			>
				<h5 className="font-bold mb-8 text-lg bg-orange-500 w-fit text-white px-2">
					Answer
				</h5>
				<div className="flex flex-col mx-auto">
					<Latex>{`$x=${toFixedIfNecessary(data.value)}$`}</Latex>
				</div>
			</div>

			<div className="flex flex-col mt-10 py-6 px-8 border-l-2 border-l-orange-500">
				<h5 className="font-bold mb-8 text-lg bg-orange-500 w-fit text-white px-2">
					Solution
				</h5>

				<div className="mx-auto">
					<Latex>{latex_string}</Latex>
				</div>
			</div>
		</div>
	);
}

export default React.memo(SimpleRegressionSolution);
