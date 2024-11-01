import { getLatexMatrix, toFixedIfNecessary } from "@/utilities/LatexFunctions";
import { spacing } from "@/data/Constants";
import Latex from "react-latex-next";
import { InversionResult } from "@/types/linear/results";
import React from "react";

const generateInversionLatex = (data: InversionResult) => {
	let latex = "$\\begin{aligned}";
	const size = data.iterations[0].a.length;
	const { iterations, b, value } = data;

	iterations?.map((e) => {
		const { a, invertedMatrix, change } = e;
		let isRowFound = false;

		if (change === undefined) {
			latex += "&";
		} else {
			latex += "\\begin{array}{c}";
			const { constant, operation, rowAffected, rowOperator } = change;

			for (let i = 0; i <= rowAffected; i++) {
				if (i !== rowAffected) {
					latex += "\\\\";
					continue;
				}

				switch (operation) {
					case "divide":
						latex += `R_${rowAffected + 1} = \\frac{R_${
							rowAffected + 1
						}}{${toFixedIfNecessary(constant)}}`;
						isRowFound = true;
						break;

					case "multiple":
						latex += `R_${rowAffected + 1} = R_${
							rowAffected + 1
						} - ${toFixedIfNecessary(constant)}R_${rowOperator + 1}`;
						isRowFound = true;
						break;
				}

				if (isRowFound === true) {
					latex += "\\\\".repeat(size - 1 - i);
					break;
				}
			}
			latex += "\\end{array} &";
		}

		latex += `\\left[\\begin{array}{${"c".repeat(size)}|${"c".repeat(size)}}`;

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				latex += `${toFixedIfNecessary(a[i][j])} & `;
			}

			for (let j = 0; j < size; j++) {
				if (j !== size - 1) {
					latex += `${toFixedIfNecessary(invertedMatrix[i][j])} & `;
				} else {
					latex += `${toFixedIfNecessary(invertedMatrix[i][j])}`;
				}
			}

			if (i !== size - 1) {
				latex += `\\\\`;
			}
		}
		latex += "\\end{array}\\right]";
		latex += `\\\\[${spacing}px]`;
	});

	const last_invertedMatrix =
		data.iterations[iterations.length - 1].invertedMatrix;
	latex += `A^{-1} &= ${getLatexMatrix(
		last_invertedMatrix,
		"bmatrix"
	)} \\\\[${spacing}px]
    
    `;
	latex += `A^{-1}AX &= A^{-1}B \\\\[${spacing - 25}px]
                    IX &= A^{-1}B \\\\[${spacing - 25}px]
                    X  &= A^{-1}B \\\\[${spacing - 25}px]`;

	latex += `X &= ${getLatexMatrix(last_invertedMatrix, "bmatrix")}`;

	latex += `\\begin{bmatrix}`;
	for (let i = 0; i < size; i++) {
		latex += `${toFixedIfNecessary(b[i])} \\\\`;
	}
	latex += `\\end{bmatrix} \\\\[${spacing}px]`;

	latex += `X &= `;

	latex += `\\begin{bmatrix}`;
	for (let i = 0; i < size; i++) {
		latex += `${toFixedIfNecessary(value[i])} \\\\`;
	}
	latex += `\\end{bmatrix}`;

	latex += "\\end{aligned}$";
	return latex;
};

function InversionSolution({ data }: { data: InversionResult }) {
	const latex_string = generateInversionLatex(data);
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

export default React.memo(InversionSolution);
