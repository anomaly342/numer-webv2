import { getNestedArray } from "@/utilities/getNestedArray";
import { LinearRequest } from "@/utilities/types";
import { ChangeEvent } from "react";
import Latex from "react-latex-next";

export default function MatrixInput({
	LinearRequest,
	onChangeSize,
	onReset,
	onChangeMatrixA,
	onChangeMatrixB,
}: {
	LinearRequest: LinearRequest;
	onChangeSize: (e: ChangeEvent<HTMLInputElement>) => void;
	onReset: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onChangeMatrixA: (
		e: ChangeEvent<HTMLInputElement>,
		i: number,
		j: number
	) => void;
	onChangeMatrixB: (e: ChangeEvent<HTMLInputElement>, i: number) => void;
}) {
	return (
		<>
			<h5 className="text-[#626262]  w-full font-bold max-w-5xl mb-3">
				Matrix
			</h5>
			<div className="flex justify-center flex-col w-full items-center mb-6 rounded-md py-7 px-6 bg-white shadow-md">
				<div>
					<label className="mr-3">{"Matrix size (NxN)"}</label>

					<input
						value={LinearRequest.size}
						onChange={onChangeSize}
						className="p-3 bg-[#E1E1E1] w-20 text-center spin h-10 mr-6"
						type="number"
						name="size"
						id="matrix-size"
						max={5}
						min={2}
					/>

					<button
						onClick={onReset}
						className="bg-[#3994C1] px-4 py-2 rounded-md border-solid text-white font-bold"
					>
						Reset
					</button>
				</div>
				<div className="flex gap-4 mt-6">
					<div className="flex flex-col items-center" id="symbol">
						<Latex>{"$[A]$"}</Latex>
						<div
							className="grid gap-2 mt-2"
							style={{
								gridTemplateRows: `repeat(${LinearRequest.size}, minmax(0, 1fr))`,
								gridTemplateColumns: `repeat(${LinearRequest.size}, minmax(0, 1fr))`,
							}}
						>
							{getNestedArray(LinearRequest.size, 0).map((e, i) =>
								e.map((_e, j) => (
									<div key={`${i}/${j}`} className="relative">
										<input
											className="size-12 sm:size-16 rounded-sm bg-[#E1E1E1] p-2 text-center focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
											type="number"
											name="cell"
											value={LinearRequest.a[i][j]}
											onChange={(e) => onChangeMatrixA(e, i, j)}
											placeholder=""
											id={`${i}/${j}`}
										/>
										<label
											id="cell"
											className="select-none pointer-events-none absolute invisible top-0 left-0 peer-placeholder-shown:left-1/2 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 text-[#9E9E9E] peer-placeholder-shown:visible !text-sm"
										>
											<Latex>{`$a_{${i + 1}${j + 1}}$`}</Latex>
										</label>
									</div>
								))
							)}
						</div>
					</div>
					<div id="symbol" className="flex flex-col items-center">
						<Latex>{"$\\{x\\}$"}</Latex>
						<div
							className="grid grid-cols-1 gap-2 mt-2"
							style={{
								gridTemplateRows: `repeat(${LinearRequest.size}, minmax(0, 1fr))`,
							}}
						>
							{Array(LinearRequest.size)
								.fill(0)
								.map((e, i) => (
									<div key={i} className="relative">
										<input
											className="size-12 sm:size-16 rounded-sm bg-[#F7F7F7] p-2 text-center focus:outline-[#E67635] peer cursor-not-allowed"
											type="number"
											name="varialbe"
											placeholder=""
											disabled
										/>
										<label
											id="variable"
											className="select-none pointer-events-none absolute invisible top-0 left-0 peer-placeholder-shown:left-1/2 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 text-[#B1B1B1] peer-placeholder-shown:visible !text-sm"
										>
											<Latex>{`$x_${i + 1}$`}</Latex>
										</label>
									</div>
								))}
						</div>
					</div>
					<div id="symbol" className="flex flex-col  items-center">
						<div className="invisible">
							<Latex>{"$[B]$"}</Latex>
						</div>
						<div className="flex flex-col justify-center h-full">
							<Latex>{"$=$"}</Latex>
						</div>
					</div>
					<div id="symbol" className="flex flex-col items-center">
						<Latex>{"$[B]$"}</Latex>
						<div
							className="grid grid-cols-1 gap-2 mt-2"
							style={{
								gridTemplateRows: `repeat(${LinearRequest.size}, minmax(0, 1fr))`,
							}}
						>
							{Array(LinearRequest.size)
								.fill(0)
								.map((e, i) => (
									<div key={i} className="relative">
										<input
											className="size-12 sm:size-16 rounded-sm bg-[#E1E1E1] p-2 text-center focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
											type="number"
											name="varialbe"
											value={LinearRequest.b[i]}
											onChange={(e) => onChangeMatrixB(e, i)}
											placeholder=""
										/>
										<label
											id="variable"
											className="select-none pointer-events-none absolute invisible top-0 left-0 peer-placeholder-shown:left-1/2 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 text-[#9E9E9E] peer-placeholder-shown:visible !text-sm"
										>
											<Latex>{`$b_${i + 1}$`}</Latex>
										</label>
									</div>
								))}
						</div>
					</div>
				</div>
				<div></div>
			</div>
		</>
	);
}
