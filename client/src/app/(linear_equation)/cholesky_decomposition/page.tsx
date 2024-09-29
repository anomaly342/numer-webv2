"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CholeskyResult, LinearRequest } from "@/utilities/types";
import { useQuery } from "@tanstack/react-query";
import { getNestedArray } from "@/utilities/getNestedArray";
import { cloneDeep } from "lodash";
import Latex from "react-latex-next";
import fetch_server from "@/utilities/fetch";
import TableSkeleton from "@/components/resultTable/TableSkeleton";
import MatrixInput from "@/components/input/MatrixInput";
import CalculateButton from "@/components/input/CalculateButton";
import CholeskySolution from "@/components/resultTable/CholeskySolution";
import "katex/dist/katex.min.css";
export default function CholeskyPage() {
	const [LinearRequest, setLinearRequest] = useState<LinearRequest>({
		size: 3,
		a: [
			[4, 2, 14],
			[2, 17, -5],
			[14, -5, 83],
		],
		b: [14, -101, 155],
	});
	const { error, data, isFetched, isError, isFetching, refetch } = useQuery({
		queryKey: ["cholesky"],
		queryFn: () =>
			fetch_server({
				endpoint: "/linear/cholesky_decomposition",
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
			<div
				id="Gaussian"
				className="flex justify-center gap-2 overflow-x-auto flex-col max-w-5xl w-full items-center mb-6 rounded-md py-7 px-6 bg-white shadow-md"
			>
				<Latex>
					{`$
                        
                        L =
                            \\begin{bmatrix} 
                            l_{11} & 0 & 0 \\\\ 
                            l_{21} & l_{22} & 0 \\\\ 
                            l_{31} & l_{32} & l_{33} 
                            \\end{bmatrix}
                        ,\\:
                        L^T =
                            \\begin{bmatrix} 
                            l_{11} & l_{21} & l_{31} \\\\ 
                            0 & l_{22} & l_{32} \\\\ 
                            0 & 0 & l_{33} 
                            \\end{bmatrix}
                            \\\\[5px] 
                                 $`}
				</Latex>
				<Latex>
					{"$\\text{Solve}\\: LL^TX = B \\: \\text{for X to solve the system}$"}
				</Latex>
				<Latex>{"$\\text{Let}\\: L^TX = Y$"}</Latex>
				<Latex>
					{
						"$\\text{First solve}\\: LY = B \\: \\text{for}\\: Y \\: \\text{and then solve} \\: L^TX = Y\\: \\text{for}\\: X$"
					}
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
						<CholeskySolution data={data as CholeskyResult}></CholeskySolution>
					) : (
						error.message
					))}
			</div>
		</main>
	);
}
