"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { RootResult, SecantRequest } from "@/utilities/types";
import { useQuery } from "@tanstack/react-query";

import MathField from "@/components/input/EditableMathField";
import AnimatedFormInput from "@/components/input/AnimatedFormInput";
import RootResultTable from "@/components/resultTable/RootResultTable";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CalculateButton from "@/components/input/CalculateButton";
import "katex/dist/katex.min.css";

export default function FixedPage() {
	const [latex, setLatex] = useState<string>("x^2 - 17");
	const [secantRequest, setSecantRequest] = useState<SecantRequest>({
		expression: latex,
		start_0: 1,
		start_1: 2,
		error: 0.000001,
	});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["secant"],
		queryFn: () =>
			fetch_server({
				endpoint: "/root/secant",
				data: {
					expression: latex,
					start_0: Number(secantRequest.start_0),
					start_1: Number(secantRequest.start_1),
					error: Number(secantRequest.error),
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

		setSecantRequest((prev) => {
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
					<Latex>{"$f(x) = $ "}</Latex>
					<MathField latex={latex} setLatex={setLatex}></MathField>
				</div>
				<h5 className="text-[#626262]  w-full font-bold mb-3">Boundary</h5>
				<div className="flex w-full flex-col justify-center  items-center rounded-md p-9 bg-white shadow-md ">
					<div className="flex flex-col md:flex-row justify-center items-center gap-5 mb-6">
						<AnimatedFormInput
							value={secantRequest.start_0}
							onChange={onChange}
							name="start_0"
						>
							Start_0
						</AnimatedFormInput>
						<AnimatedFormInput
							value={secantRequest.start_1}
							onChange={onChange}
							name="start_1"
						>
							Start_1
						</AnimatedFormInput>
					</div>
					<AnimatedFormInput
						value={secantRequest.error}
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
							method="secant"
							expression={latex}
						></RootResultTable>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
