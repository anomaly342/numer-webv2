"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { LinearRequest, CramerResult } from "@/utilities/types";
import { useQuery } from "@tanstack/react-query";
import { montserrat } from "@/utilities/fonts";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CramerSolution from "@/components/resultTable/CramerSolution";
import "katex/dist/katex.min.css";

const getNestedArray = (size: number, fill: number | string) => {
	console.log(size);
	// Create a new array with 'size' number of rows
	return Array.from({ length: size }, () => Array(size).fill(fill));
};

export default function CramerPage() {
	const [LinearRequest, setLinearRequest] = useState<LinearRequest>({
		size: 3,
		a: [
			[7, 1, 5],
			[4, 3, 5],
			[6, 1, 2],
		],
		b: [27, 21, 9],
	});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["cramer"],
		queryFn: () =>
			fetch_server({
				endpoint: "/linear/cramer",
				data: {
					size: LinearRequest.size,
					a: LinearRequest.a,
					b: LinearRequest.b,
				},
			}),
		enabled: false,
		retry: false,
	});

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		refetch();
	};

	const onChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const size = Number(e.target.value);
		const nestedArr = getNestedArray(size, "");
		setLinearRequest((prev) => {
			return { ...prev, size: size, a: nestedArr };
		});
	};

	const onChangeMatrixA = (
		e: ChangeEvent<HTMLInputElement>,
		row: number,
		column: number
	) => {
		e.preventDefault();

		const tempMatrix = cloneDeep(LinearRequest.a);
		tempMatrix[row][column] =
			e.target.value === "" ? "" : Number(e.target.value);

		setLinearRequest((prev) => {
			return { ...prev, a: tempMatrix };
		});
	};

	const onChangeMatrixB = (e: ChangeEvent<HTMLInputElement>, row: number) => {
		e.preventDefault();

		const tempMatrix = cloneDeep(LinearRequest.b);
		tempMatrix[row] = e.target.value === "" ? "" : Number(e.target.value);

		setLinearRequest((prev) => {
			return { ...prev, b: tempMatrix };
		});
	};

	const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setLinearRequest((prev) => {
			return {
				...prev,
				a: getNestedArray(LinearRequest.size, ""),
				b: new Array(LinearRequest.size).fill(""),
			};
		});
	};
	return (
		<main className="w-full flex flex-col py-6 items-center px-4">
			<h5 className="text-[#626262]  w-full font-bold max-w-5xl mb-3">
				Definition
			</h5>
			<div className="flex justify-center flex-col max-w-5xl w-full items-center mb-6 rounded-md py-7 px-6 bg-white shadow-md">
				<Latex>
					{"$x_i = \\frac{\\det(A_i)}{\\det(A)}\\:and\\:\\det(A)\\neq0$"}
				</Latex>
			</div>
			<form
				onSubmit={onSubmit}
				method=""
				className="flex flex-col items-center   max-w-5xl w-full"
			>
				<h5 className="text-[#626262]  w-full font-bold mb-3">Matrix</h5>
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
												className="size-16 rounded-sm bg-[#E1E1E1] p-2 text-center focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
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
										<div key={uuidv4()} className="relative">
											<input
												className="size-16 rounded-sm bg-[#F7F7F7] p-2 text-center focus:outline-[#E67635] peer cursor-not-allowed"
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
												className="size-16 rounded-sm bg-[#E1E1E1] p-2 text-center focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
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

				<button
					className={`${
						montserrat.className
					} mt-4 text-3xl text-[#F7F7F7] rounded-md font-bold bg-[#7BB026] px-4 py-3 ${
						isFetching ? "disabled:bg-[#577a1d]" : ""
					}`}
					type="submit"
					disabled={isFetching}
				>
					Calculate
				</button>
			</form>

			<div className="flex flex-col items-center max-w-7xl w-full mt-12">
				{isFetching && <TableSkeleton></TableSkeleton>}

				{isFetched &&
					!isFetching &&
					(!isError ? (
						<CramerSolution data={data as CramerResult}></CramerSolution>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
