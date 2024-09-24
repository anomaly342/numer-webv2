"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { BisectionRequest, Result } from "@/utilities/types";
import { useQuery } from "@tanstack/react-query";
import { montserrat } from "@/utilities/fonts";

import MathField from "@/components/input/EditableMathField";
import AnimatedFormInput from "@/components/input/AnimatedFormInput";
import RootResultTable from "@/components/resultTable/RootResultTable";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import "katex/dist/katex.min.css";

export default function FalsiPage() {
	const [latex, setLatex] = useState<string>("x^4-7");
	const [rootRequest, setRootRequest] = useState<BisectionRequest>({
		expression: latex,
		start: 0,
		end: 4,
		error: 0.000001,
	});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["falsi"],
		queryFn: () =>
			fetch_server({
				endpoint: "/root/false_position",
				data: {
					expression: latex,
					start: Number(rootRequest.start),
					end: Number(rootRequest.end),
					error: Number(rootRequest.error),
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

		setRootRequest((prev) => {
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
					<div className="flex justify-center flex-col md:flex-row items-center gap-5 mb-6">
						<AnimatedFormInput
							value={rootRequest.start}
							onChange={onChange}
							name="start"
						>
							Start
						</AnimatedFormInput>
						<AnimatedFormInput
							value={rootRequest.end}
							onChange={onChange}
							name="end"
						>
							End
						</AnimatedFormInput>
					</div>
					<AnimatedFormInput
						value={rootRequest.error}
						onChange={onChange}
						name="error"
					>
						Error Tolerance
					</AnimatedFormInput>
					<hr className="w-4/5 md:w-3/5 border-0.5 mt-7 border-solid border-black"></hr>
					<button
						className={`${
							montserrat.className
						} mt-7 text-3xl text-[#F7F7F7] rounded-md font-bold bg-[#7BB026] px-4 py-3 ${
							isFetching ? "disabled:bg-[#577a1d]" : ""
						}`}
						type="submit"
						disabled={isFetching}
					>
						Calculate
					</button>
				</div>
			</form>

			<div className="flex flex-col items-center max-w-7xl w-full mt-12">
				{isFetching && <TableSkeleton></TableSkeleton>}

				{isFetched &&
					!isFetching &&
					(!isError ? (
						<RootResultTable
							data={data as Result}
							method="bisection"
						></RootResultTable>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
