"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CalculateButton from "@/components/input/CalculateButton";
import "katex/dist/katex.min.css";
import { InterpolationRequest } from "@/types/interpolation/requests";
import { cloneDeep } from "lodash";
import { SplineResult } from "@/types/interpolation/results";
import SplineSolution from "@/components/resultTable/SplineSolution";

export default function SplinePage() {
	const [NewtonDividedRequest, setNewtonDividedRequest] =
		useState<InterpolationRequest>({
			n_point: 5,
			x: [0, 20000, 40000, 60000, 80000],
			y: [9.81, 9.7487, 9.6879, 9.6879, 9.5682],
			requestX: "",
		});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["spline"],
		queryFn: () =>
			fetch_server({
				endpoint: "/interpolation/spline",
				data: {
					n_point: NewtonDividedRequest.n_point,
					x: NewtonDividedRequest.x,
					y: NewtonDividedRequest.y,
					requestX: NewtonDividedRequest.requestX,
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
		setNewtonDividedRequest((prev) => {
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
		setNewtonDividedRequest((prev) => {
			return {
				...prev,
				requestX: n,
			};
		});
	};

	const onChangeX = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		e.preventDefault();

		const temp = cloneDeep(NewtonDividedRequest.x);
		temp[index] = e.target.value === "" ? "" : Number(e.target.value);

		setNewtonDividedRequest((prev) => {
			return { ...prev, x: temp };
		});
	};

	const onChangeY = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		e.preventDefault();

		const temp = cloneDeep(NewtonDividedRequest.y);
		temp[index] = e.target.value === "" ? "" : Number(e.target.value);

		setNewtonDividedRequest((prev) => {
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
							value={NewtonDividedRequest.n_point}
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
							value={NewtonDividedRequest.requestX}
							onChange={onChangeReqX}
							className="p-3 mb-4 w-32 text-center spin h-10 rounded-md border-[1px] ml-3 border-gray-300"
							type="number"
							name="size"
							id="matrix-size"
							placeholder="Request X"
						/>
					</div>

					{Array(NewtonDividedRequest.n_point)
						.fill(0)
						.map((e, i) => (
							<div key={`form${i}`} className="flex items-center mb-2 gap-2">
								<h5>{i + 1}.</h5>
								<div className="relative" id="symbol">
									<input
										className="h-9 rounded-md border-[1px] border-gray-300 py-5  p-3 text-left focus:outline-[#E67635] peer outline-transparent transition-all duration-300"
										type="number"
										name="cell"
										placeholder=""
										onChange={(e) => onChangeX(e, i)}
										value={NewtonDividedRequest.x[i]}
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
										value={NewtonDividedRequest.y[i]}
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
						<SplineSolution data={data as SplineResult}></SplineSolution>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
