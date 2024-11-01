"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MathField from "@/components/input/EditableMathField";
import AnimatedFormInput from "@/components/input/AnimatedFormInput";
import RootResultTable from "@/components/resultTable/RootResultTable";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CalculateButton from "@/components/input/CalculateButton";
import "katex/dist/katex.min.css";
import { FixedPointRequest } from "@/types/root/requests";
import { RootResult } from "@/types/root/results";

export default function FixedPage() {
	const [latex, setLatex] = useState<string>("\\frac{x ^ 2 - 17 + 13x}{13}");
	const [fixedRequest, setFixedRequest] = useState<FixedPointRequest>({
		expression: latex,
		start: 2,
		error: 0.000001,
	});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["fixed_point"],
		queryFn: () =>
			fetch_server({
				endpoint: "/root/fixed_point",
				data: {
					expression: latex,
					start: Number(fixedRequest.start),
					error: Number(fixedRequest.error),
				},
			}),
		enabled: false,
		retry: false,
	});
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		refetch();
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		setFixedRequest((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	return (
		<main className="w-full flex flex-col py-6 items-center px-4">
			<form
				onSubmit={onSubmit}
				method=""
				className="flex flex-col items-center   max-w-5xl w-full"
			>
				<h5 className="text-[#626262] w-full font-bold mb-3">Function</h5>
				<div className="flex justify-center w-full items-center mb-6 gap-4 rounded-md p-6 bg-white shadow-md">
					<Latex>{"$x_{n+1} = $ "}</Latex>
					<MathField latex={latex} setLatex={setLatex}></MathField>
				</div>
				<h5 className="text-[#626262]  w-full font-bold mb-3">Boundary</h5>
				<div className="flex w-full flex-col justify-center  items-center rounded-md p-9 bg-white shadow-md ">
					<div className="flex justify-center items-center gap-5 mb-6">
						<AnimatedFormInput
							value={fixedRequest.start}
							onChange={onChange}
							name="start"
						>
							Initial
						</AnimatedFormInput>
					</div>
					<AnimatedFormInput
						value={fixedRequest.error}
						onChange={onChange}
						name="error"
					>
						Error Tolerance
					</AnimatedFormInput>
					<hr className="w-4/5 md:w-3/5 border-0.5 mt-7 border-solid border-black"></hr>
					<CalculateButton isFetching={isFetching}></CalculateButton>
				</div>
			</form>

			<div className="flex flex-col items-center max-w-7xl w-full mt-12">
				{isFetching && <TableSkeleton></TableSkeleton>}

				{isFetched &&
					!isFetching &&
					(!isError ? (
						<RootResultTable
							data={data as RootResult}
							method="fixed_point"
							expression={latex}
						></RootResultTable>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
