import { Iteration, Result } from "@/utilities/types";
import dynamic from "next/dynamic";
import Latex from "react-latex-next";

const Plot = dynamic(() => import("react-plotly.js"), {
	ssr: false,
});

export default function RootResultTable({ data }: { data: Result }) {
	const graphData = data.iterations.map((e, i) => {
		return { x: e.t, y: e.ft, index: i };
	});
	const column_headers = Object.keys(data.iterations[0]);

	return (
		<div className="bg-white w-full shadow-md rounded-md px-6 py-12 flex flex-col items-center">
			<div id="Latex" className="text-center">
				<Latex>$x={data.value.toString()}$</Latex>
			</div>
			<Plot
				className="mt-6"
				data={[
					{
						x: graphData.map((e) => e.x),
						y: graphData.map((e) => e.y),

						mode: "number+delta",
						marker: { color: "red" },
					},
				]}
				layout={{ width: 800, height: 800, title: "A Fancy Plot" }}
			/>
			<table className="mt-8 w-full ">
				<thead className="border-b-[1px] border-solid w-full border-[#B1B1B1]">
					<tr className="text-[#626262] font-normal sticky top-0 bg-white">
						<th className="text-left py-4 pl-2 w-[12%]">Iteration</th>
						{column_headers.map((e) => (
							<th key={e} className={`text-left py-4`}>
								{e.toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-left">
					{data.iterations.map((e, index) => {
						return (
							<tr
								key={index}
								className="border-b-[1px] border-solid border-[#CFCFCF] even:bg-[#F7F7F7]"
							>
								<td className="pl-2 py-3">{index}</td>
								{column_headers.map((header) => (
									<td key={`${header}/${index}`} className="py-3">
										{e[header as keyof Iteration]}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
