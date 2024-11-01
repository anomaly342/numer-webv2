import Latex from "react-latex-next";
import React from "react";
import { SplineResult } from "@/types/interpolation/results";
import { toFixedIfNecessary } from "@/utilities/LatexFunctions";
const generateSplineLatex = (data: SplineResult) => {
	const { requestX, value, x_high, x_low, y_high, y_low } = data;

	let latex = "$\\begin{aligned}";

	latex += `\\text{From} \\quad f(x) &= f(x_{i-1}) + \\frac{f(x_i) - f(x_{i-1})}{x_i - x_{i-1}}\\cdot(x-x_{i-1}),\\enspace x_{i-1} \\leq x \\leq x_{i+1} \\\\[12px]`;
	latex += `\\text{Therefore}\\quad f(${requestX}) &= ${y_low} + \\frac{${y_high} - ${y_low}}{${x_high} - ${x_low}}\\cdot(${requestX} - ${x_low}) \\\\[10px]`;

	latex += `&= ${value}`;
	latex += `\\end{aligned}$`;

	return latex;
};

function SplineSolution({ data }: { data: SplineResult }) {
	const latex_string = generateSplineLatex(data);
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

export default React.memo(SplineSolution);
