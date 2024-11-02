"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CalculateButton from "@/components/input/CalculateButton";
import "katex/dist/katex.min.css";
import { cloneDeep } from "lodash";
import { ExtrapolationRequest } from "@/types/extrapolation/requests";
import SimpleRegression from "@/components/resultTable/SimpleRegression";
import { ExtrapolationResult } from "@/types/extrapolation/results";

export default function SimpleRegressionPage() {
	const [ExtrapolationRequest, setExtrapolationRequest] =
		useState<ExtrapolationRequest>({
			n_point: 9,
			x: [10, 15, 20, 30, 40, 50, 60, 70, 80],
			y: [5, 9, 15, 18, 22, 30, 35, 38, 43],
			requestX: "",
			m: "",
		});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["simple_regression"],
		queryFn: () =>
			fetch_server({
				endpoint: "/extrapolation/simple_regression",
				data: {
					n_point: ExtrapolationRequest.n_point,
					x: ExtrapolationRequest.x,
					y: ExtrapolationRequest.y,
					requestX: ExtrapolationRequest.requestX,
					m: ExtrapolationRequest.m,
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

		const n = Number(e.target.value);
		setExtrapolationRequest((prev) => {
			return {
				...prev,
				n_point: n,
				x: Array(n).fill(""),
				y: Array(n).fill(""),
			};
		});
	};

	const onChangeReqX = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const n = e.target.value === "" ? "" : Number(e.target.value);
		setExtrapolationRequest((prev) => {
			return {
				...prev,
				requestX: n,
			};
		});
	};

	const onChangeX = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		e.preventDefault();

		const temp = cloneDeep(ExtrapolationRequest.x);
		temp[index] = e.target.value === "" ? "" : Number(e.target.value);

		setExtrapolationRequest((prev) => {
			return { ...prev, x: temp };
		});
	};

	const onChangeY = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		e.preventDefault();

		const temp = cloneDeep(ExtrapolationRequest.y);
		temp[index] = e.target.value === "" ? "" : Number(e.target.value);

		setExtrapolationRequest((prev) => {
			return { ...prev, y: temp };
		});
	};

	return (
		<main className="w-full flex flex-col py-6 items-center px-4">
			<form
				onSubmit={onSubmit}
				method=""
				className="flex flex-col items-center   max-w-5xl w-full"
			>
				<h5 className="text-[#626262]  w-full font-bold mb-3">Table</h5>
				<div className="flex flex-col justify-center w-full items-center mb-6 rounded-md p-6 bg-white shadow-md">
					<div>
						<label>Number of points</label>
						<input
							value={ExtrapolationRequest.n_point}
							onChange={onChangeSize}
							className="p-3 mb-2 mt-4  w-20 text-center spin h-10 rounded-md border-[1px] ml-3 border-gray-300"
							type="number"
							name="size"
							id="matrix-size"
							min={2}
						/>
					</div>
					<div>
						<input
							value={ExtrapolationRequest.requestX}
							onChange={onChangeReqX}
							className="p-3 mb-4 w-32 text-center  h-10 rounded-md border-[1px] ml-3 border-gray-300"
							type="number"
							name="size"
							id="matrix-size"
							placeholder="Request X"
						/>
						<input
							value={ExtrapolationRequest.m}
							onChange={(e) => {
								e.preventDefault();

								const value =
									e.target.value === "" ? "" : Number(e.target.value);
								setExtrapolationRequest((prev) => {
									return { ...prev, m: value };
								});
							}}
							className="p-3 mb-4 w-24 text-center spin h-10 rounded-md border-[1px] ml-3 border-gray-300"
							type="number"
							name="m"
							id="m"
							placeholder="m"
						/>
					</div>

					{Array(ExtrapolationRequest.n_point)
						.fill(0)
						.map((e, i) => (
							<div key={`form${i}`} className="flex  items-center mb-2 gap-2">
								<h5 className="tabular-nums">{i + 1}.</h5>
								<div className="relative" id="symbol">
									<input
										className="h-9 rounded-md border-[1px] border-gray-300 py-5  p-3 text-left focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
										type="number"
										name="cell"
										placeholder=""
										onChange={(e) => onChangeX(e, i)}
										value={ExtrapolationRequest.x[i]}
										id={`4`}
									/>
									<label
										id="cell"
										className="select-none pointer-events-none absolute invisible top-0 left-0 peer-placeholder-shown:left-6 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 text-[#9E9E9E] peer-placeholder-shown:visible !text-sm"
									>
										<Latex>{`$x_{${i + 1}}$`}</Latex>
									</label>
								</div>

								<div className="relative">
									<input
										className="h-9 rounded-md border-[1px] border-gray-300  py-5  p-3 text-left focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
										type="number"
										name="cell"
										placeholder=""
										onChange={(e) => onChangeY(e, i)}
										value={ExtrapolationRequest.y[i]}
										id={`4`}
									/>
									<label
										id="cell"
										className="select-none pointer-events-none absolute invisible top-0 left-0 peer-placeholder-shown:left-9 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 text-[#9E9E9E] peer-placeholder-shown:visible !text-sm"
									>
										<Latex>{`$f(x_{${i + 1}})$`}</Latex>
									</label>
								</div>
							</div>
						))}
				</div>
				<CalculateButton isFetching={isFetching}></CalculateButton>
			</form>

			<div className="flex flex-col items-center max-w-7xl w-full mt-12">
				{isFetching && <TableSkeleton></TableSkeleton>}

				{isFetched &&
					!isFetching &&
					(!isError ? (
						<SimpleRegression
							data={data as ExtrapolationResult}
						></SimpleRegression>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
