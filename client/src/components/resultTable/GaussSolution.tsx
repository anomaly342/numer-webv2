import { GaussResult } from "@/utilities/types";
import Latex from "react-latex-next";

const spacing = "22";

function toFixedIfNecessary(value: number) {
	return +value.toFixed(5);
}

const generateGaussLatex = (data: GaussResult) => {
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
					console.log({ repeat: size - 1 - i });
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

	const last_iteration = iterations[iterations.length - 1];

	for (let i = size - 1; i >= 0; i--) {
		latex += `x_${i + 1}`;
		for (let j = i + 1; j < size; j++) {
			latex += `+ ${toFixedIfNecessary(last_iteration.a[i][j])}x_${j + 1}`;
		}
		latex += `&= ${toFixedIfNecessary(last_iteration.b[i])} \\\\`;
	}

	latex += "\\end{aligned}$";
	return latex;
};

export default function GaussSolution({ data }: { data: GaussResult }) {
	const latex_string = generateGaussLatex(data);
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

				{/* <Latex>
					{`$
					\\begin{aligned}
					   \\begin{array}{c}
						 	row 1 \\\\ row 2
					   \\end{array} 
					   &
					   \\left[
							\\begin{array}{ccc|c} 
								1 & 4 & 5 & 1 \\\\ 
								2 & 4 & 5 & 4 
							\\end{array}
					   \\right]  
					   \\\\[18px]
					  
					   \\begin{array}{c} 
							row 1 \\\\ row 2
					   \\end{array} 
					   &
					   \\left[
							\\begin{array}{ccc|c} 
								1 & 4 & 5 & 1 \\\\ 
								2 & 4 & 5 & 4 
							\\end{array}
					   \\right]
					\\end{aligned}		
					  $`}
				</Latex> */}
				<div className="mx-auto">
					<Latex>{latex_string}</Latex>
				</div>
			</div>
		</div>
	);
}
