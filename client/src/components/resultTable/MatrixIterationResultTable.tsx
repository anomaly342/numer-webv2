import { MatrixIterationResult } from "@/types/linear/results";
import Latex from "react-latex-next";
import { toFixedIfNecessary } from "@/utilities/LatexFunctions";
import React from "react";
const toLatex = (iteration: number[], symbol: string) => {
	let latex = "$";

	for (let i = 0; i < iteration.length; i++) {
		latex += `${symbol}_${i + 1} = ${toFixedIfNecessary(iteration[i])}\\\\`;
	}

	latex += "$";

	return latex;
};

function MatrixIterationResultTable({ data }: { data: MatrixIterationResult }) {
	return (
		<div className="bg-white w-full shadow-md rounded-md px-6 py-12 flex flex-col items-center">
			<div className="flex flex-col mx-auto">
				{data.value.map((e, i) => (
					<Latex key={`x_value${i}`}>{`$x_${i + 1}=${toFixedIfNecessary(
						e
					)}$`}</Latex>
				))}
			</div>

			<div className="w-full overflow-x-auto" id="symbol">
				<table className="mt-8 w-full">
					<thead className="border-b-[1px] border-solid border-[#B1B1B1]">
						<tr className="text-[#626262] font-normal top-0 bg-white">
							<th className="text-left py-4 pl-2">Iteration</th>

							<th className={`text-left min-w-5 py-4`}>
								<Latex> {"$x_k$"} </Latex>
							</th>
							<th className={`text-left min-w-5 py-4`}>
								<Latex> {"$x_k$"} </Latex>
							</th>
						</tr>
					</thead>
					<tbody className="text-left">
						{data.iterations.map((e, index) => {
							return (
								<tr
									key={`x_ith${index}`}
									className="hover:bg-[#FFEFE6] border-b-[1px] border-solid border-[#CFCFCF] even:bg-[#F7F7F7]"
								>
									<td className="pl-2 py-3">
										<Latex>{`$${index + 1}$`}</Latex>
									</td>

									<td className="py-3">
										<Latex>{`${toLatex(e.iteration, "x")}`}</Latex>
									</td>

									<td className="py-3 min-w-48">
										<Latex>{`${toLatex(e.error, "e")}`}</Latex>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default React.memo(MatrixIterationResultTable);
