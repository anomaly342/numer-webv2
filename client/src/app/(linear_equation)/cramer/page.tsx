"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { LinearRequest } from "@/types/linear/requests";
import { CramerResult } from "@/types/linear/results";
import { useQuery } from "@tanstack/react-query";
import { getNestedArray } from "@/utilities/getNestedArray";
import { cloneDeep } from "lodash";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CramerSolution from "@/components/resultTable/CramerSolution";
import MatrixInput from "@/components/input/MatrixInput";
import CalculateButton from "@/components/input/CalculateButton";
import "katex/dist/katex.min.css";

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
			return { ...prev, size: size, a: nestedArr, b: Array(size).fill("") };
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
				<MatrixInput
					LinearRequest={LinearRequest}
					onChangeMatrixA={onChangeMatrixA}
					onChangeMatrixB={onChangeMatrixB}
					onChangeSize={onChangeSize}
					onReset={onReset}
				></MatrixInput>

				<CalculateButton isFetching={isFetching}></CalculateButton>
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
