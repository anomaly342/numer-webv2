import { toFixedIfNecessary } from "@/utilities/LatexFunctions";
import { spacing } from "@/data/Constants";
import Latex from "react-latex-next";
import { GaussResult } from "@/types/linear/results";
import React from "react";

const generateGaussLatex = (data: GaussResult, isJordan: boolean) => {
	let latex = "$\\begin{aligned}";
	const size = data.iterations[0].a.length;
	const { iterations } = data;

	iterations?.map((e) => {
		const { a, b, change } = e;
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

		latex += `\\left[\\begin{array}{${"c".repeat(size)}|c}`;

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				latex += `${toFixedIfNecessary(a[i][j])} & `;
			}

			if (i !== size - 1) {
				latex += `${toFixedIfNecessary(b[i])} \\\\`;
			} else {
				latex += `${toFixedIfNecessary(b[i])}`;
			}
		}
		latex += "\\end{array}\\right]";
		latex += `\\\\[${spacing}px]`;
	});
	if (isJordan === false) {
		const last_iteration = iterations[iterations.length - 1];
		for (let i = 0; i < size; i++) {
			latex += `x_${i + 1}`;
			for (let j = i + 1; j < size; j++) {
				latex += `+ ${toFixedIfNecessary(last_iteration.a[i][j])}x_${j + 1}`;
			}
			latex += `&= ${toFixedIfNecessary(last_iteration.b[i])} \\\\`;
		}
	}

	latex += "\\end{aligned}$";
	return latex;
};

function GaussSolution({
	data,
	isJordan,
}: {
	data: GaussResult;
	isJordan: boolean;
}) {
	const latex_string = generateGaussLatex(data, isJordan);
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

export default React.memo(GaussSolution);
