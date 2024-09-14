export default function TableSkeleton() {
	return (
		<div className="bg-white w-full shadow-md rounded-md p-6 flex flex-col animate-pulse">
			<div id="Latex" className="text-center">
				<div className="h-6 bg-gray-200 w-1/4 rounded mx-auto"></div>
			</div>
			<table className="mt-8">
				<thead className="border-b-[1px] border-solid border-[#B1B1B1]">
					<tr className="text-[#626262] font-normal">
						<th className="w-[20%] text-left pb-4 pl-2">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</th>
						<th className="w-[20%] text-left pb-4">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</th>
						<th className="w-[20%] text-left pb-4">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</th>
						<th className="w-[20%] text-left pb-4">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</th>
						<th className="w-[20%] text-left pb-4">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</th>
					</tr>
				</thead>
				<tbody className="text-left">
					<tr className="border-b-[1px] border-solid border-[#CFCFCF] even:bg-[#F7F7F7]">
						<td className="pl-1 py-3">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</td>
						<td className="py-3 pl-1">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</td>
						<td className="py-3 pl-1">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</td>
						<td className="py-3 pl-1">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</td>
						<td className="py-3 pl-1">
							<div className="h-4 bg-gray-200 w-full rounded"></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
