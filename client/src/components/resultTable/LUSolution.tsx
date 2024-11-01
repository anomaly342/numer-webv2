import { getLatexMatrix, toFixedIfNecessary } from "@/utilities/LatexFunctions";
import { spacing } from "@/data/Constants";
import Latex from "react-latex-next";
import { LUResult } from "@/types/linear/results";
import React from "react";

const generateLULatex = (data: LUResult) => {
	let latex = "$\\begin{aligned}";
	const { upper, lower, y, b, invertedUpper, invertedLower, value } = data;

	latex += `L &= ${getLatexMatrix(lower, "bmatrix")}\\\\[${spacing}px]`;
	latex += `U &= ${getLatexMatrix(upper, "bmatrix")}\\\\[${spacing}px]`;
	latex += `LUX &= B\\\\[${spacing - 25}px]`;
	latex += `\\text{Let}\\qquad UX &= Y\\\\[${spacing - 25}px]`;
	latex += `\\text{First solve}\\qquad LY &= B\\quad\\text{for}\\: Y\\\\[${
		spacing - 25
	}px]`;
	latex += `Y &= L^{-1}B\\\\[${spacing - 25}px]`;
	latex += `Y &= ${getLatexMatrix(invertedLower, "bmatrix")}`;
	latex += `\\begin{bmatrix}`;
	b.map((e) => {
		latex += `${toFixedIfNecessary(e)} \\\\`;
	});
	latex += `\\end{bmatrix}\\\\[${spacing}px]`;

	latex += `Y &= `;
	latex += `\\begin{bmatrix}`;
	y.map((e) => {
		latex += `${toFixedIfNecessary(e)} \\\\`;
	});
	latex += `\\end{bmatrix}\\\\[${spacing}px]`;

	latex += `\\text{Then solve}\\qquad UX &= Y\\quad\\text{for}\\: X\\\\[${
		spacing - 25
	}px]`;

	latex += `X &= U^{-1}Y\\\\[${spacing - 25}px]`;

	latex += `X &= ${getLatexMatrix(invertedUpper, "bmatrix")}`;

	latex += `\\begin{bmatrix}`;
	y.map((e) => {
		latex += `${toFixedIfNecessary(e)} \\\\`;
	});
	latex += `\\end{bmatrix}\\\\[${spacing}px]`;

	latex += `X &= `;
	latex += `\\begin{bmatrix}`;
	value.map((e) => {
		latex += `${toFixedIfNecessary(e)} \\\\`;
	});
	latex += `\\end{bmatrix}\\\\[${spacing}px]`;

	latex += "\\end{aligned}$";
	return latex;
};

function LUSolution({ data }: { data: LUResult }) {
	const latex_string = generateLULatex(data);
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
					{data.value.map((e, i) => (
						<Latex key={i}>{`$x_${i + 1}=${toFixedIfNecessary(e)}$`}</Latex>
					))}
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

export default React.memo(LUSolution);