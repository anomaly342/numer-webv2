"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNestedArray } from "@/utilities/getNestedArray";
import { MatrixIterationRequest } from "@/types/linear/requests";
import { cloneDeep } from "lodash";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import CalculateButton from "@/components/input/CalculateButton";
import "katex/dist/katex.min.css";
import MatrixInputWithX0 from "@/components/input/MatrixInputWithX0";
import MatrixIterationResultTable from "@/components/resultTable/MatrixIterationResultTable";
import { MatrixIterationResult } from "@/types/linear/results";

export default function SeidelPage() {
	const [MatrixIterationRequest, setMatrixIterationRequest] =
		useState<MatrixIterationRequest>({
			size: 4,
			a: [
				[5, 2, 0, 0],
				[2, 5, 2, 0],
				[0, 2, 5, 2],
				[0, 0, 2, 5],
			],
			b: [12, 17, 14, 7],
			initial_xs: [0, 0, 0, 0],
			error: 0.05,
		});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["seidel"],
		queryFn: () =>
			fetch_server({
				endpoint: "/linear/gauss-seidel_iteration",
				data: {
					size: MatrixIterationRequest.size,
					a: MatrixIterationRequest.a,
					b: MatrixIterationRequest.b,
					initial_xs: MatrixIterationRequest.initial_xs,
					error: MatrixIterationRequest.error,
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
		setMatrixIterationRequest((prev) => {
			return {
				...prev,
				size: size,
				a: nestedArr,
				b: Array(size).fill(""),
				initial_xs: Array(size).fill(""),
			};
		});
	};

	const onChangeMatrixA = (
		e: ChangeEvent<HTMLInputElement>,
		row: number,
		column: number
	) => {
		e.preventDefault();

		const tempMatrix = cloneDeep(MatrixIterationRequest.a);
		tempMatrix[row][column] =
			e.target.value === "" ? "" : Number(e.target.value);

		setMatrixIterationRequest((prev) => {
			return { ...prev, a: tempMatrix };
		});
	};

	const onChangeMatrixB = (e: ChangeEvent<HTMLInputElement>, row: number) => {
		e.preventDefault();

		const tempMatrix = cloneDeep(MatrixIterationRequest.b);
		tempMatrix[row] = e.target.value === "" ? "" : Number(e.target.value);

		setMatrixIterationRequest((prev) => {
			return { ...prev, b: tempMatrix };
		});
	};

	const onChangeInitialXS = (e: ChangeEvent<HTMLInputElement>, row: number) => {
		e.preventDefault();

		const tempMatrix = cloneDeep(MatrixIterationRequest.initial_xs);
		tempMatrix[row] = e.target.value === "" ? "" : Number(e.target.value);

		setMatrixIterationRequest((prev) => {
			return { ...prev, initial_xs: tempMatrix };
		});
	};

	const onChangeError = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const value = e.target.value === "" ? "" : Number(e.target.value);

		setMatrixIterationRequest((prev) => {
			return { ...prev, error: value };
		});
	};

	const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setMatrixIterationRequest((prev) => {
			return {
				...prev,
				a: getNestedArray(MatrixIterationRequest.size, ""),
				b: new Array(MatrixIterationRequest.size).fill(""),
			};
		});
	};
	return (
		<main className="w-full flex flex-col py-6 items-center px-4">
			<form
				onSubmit={onSubmit}
				method=""
				className="flex flex-col items-center   max-w-5xl w-full"
			>
				<MatrixInputWithX0
					MatrixIterationRequest={MatrixIterationRequest}
					onChangeMatrixA={onChangeMatrixA}
					onChangeMatrixB={onChangeMatrixB}
					onChangeInitialXS={onChangeInitialXS}
					onChangeSize={onChangeSize}
					onReset={onReset}
					onChangeError={onChangeError}
				></MatrixInputWithX0>

				<CalculateButton isFetching={isFetching}></CalculateButton>
			</form>

			<div className="flex flex-col items-center max-w-7xl w-full mt-12">
				{isFetching && <TableSkeleton></TableSkeleton>}

				{isFetched &&
					!isFetching &&
					(!isError ? (
						<MatrixIterationResultTable
							data={data as MatrixIterationResult}
						></MatrixIterationResultTable>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
