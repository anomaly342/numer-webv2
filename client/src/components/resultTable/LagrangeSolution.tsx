import Latex from "react-latex-next";
import React from "react";
import { LagrangeResult } from "@/types/interpolation/results";
import { toFixedIfNecessary } from "@/utilities/LatexFunctions";
const generateLagrangeLatex = (data: LagrangeResult) => {
	const { l_list, requestX, value, x } = data;
	const n = x.length;

	let latex = "$\\begin{aligned}";
	let upper = "";
	let lower = "";
	for (let i = 0; i < n; i++) {
		latex += `L_${i + 1} &= `;
		upper = "";
		lower = "";
		for (let j = 0; j < n; j++) {
			if (i != j) {
				upper += `(${x[j]} - ${requestX})`;
				lower += `(${x[j]} - ${x[i]})`;
			}
		}

		latex += `\\frac{${upper}}{${lower}} &= ${toFixedIfNecessary(
			l_list[i]
		)} \\\\[12px]`;
	}

	latex += `f(${requestX}) &= `;
	for (let i = 0; i < n; i++) {
		latex += `L_${i + 1}\\cdot f(${x[i]})`;
		if (i != n - 1) {
			latex += "+";
		}
	}

	latex += `\\\\ &= ${toFixedIfNecessary(value)}`;

	latex += `\\end{aligned}$`;

	return latex;
};

function LagrangeSolution({ data }: { data: LagrangeResult }) {
	const latex_string = generateLagrangeLatex(data);
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

export default React.memo(LagrangeSolution);
