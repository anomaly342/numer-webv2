import {
	RootResult,
	BisectionIteration,
	FixedPointIteration,
} from "@/types/root/results";
import { ComputeEngine } from "@cortex-js/compute-engine";
const range = (start: number, stop: number, step = 1) =>
	Array(Math.ceil((stop - start) / step))
		.fill(start)
		.map((x, y) => x + y * step);

const getGraphData = (
	data: RootResult,
	method: string,
	expression?: string
) => {
	const ce = new ComputeEngine();
	let iterations;
	if (method === "bisection") {
		iterations = data?.iterations as BisectionIteration[];
		const xs: number[] = [];
		const ys: number[] = [];

		iterations.map((e) => {
			xs.push(e.t);
			ys.push(e.ft);
		});
		return [
			{
				x: xs,
				y: ys,

				mode: "number+delta",
				marker: { color: "red" },
			},
		];
	} else if (method == "fixed_point") {
		if (!expression) {
			return 0;
		}

		const parsedExpression = ce.parse(expression);

		iterations = data?.iterations as FixedPointIteration[];
		const length = iterations.length;
		const xs: number[] = [];
		const ys: number[] = [];
		for (let i = 0; i < length - 1; i++) {
			xs.push(iterations[i].x);
			ys.push(iterations[i + 1].x);
			xs.push(iterations[i + 1].x);
			ys.push(iterations[i + 1].x);
		}
		const min = Math.min(...xs);
		const max = Math.max(...xs);
		const arrRange = range(min, max, 0.01);
		return [
			{
				x: xs,
				y: ys,
				mode: "lines+marker",
				marker: { color: "red" },
			},
			{
				x: arrRange,
				y: arrRange,

				mode: "lines",
				marker: { color: "green" },
			},
			{
				x: arrRange,
				y: arrRange.map((e) => {
					ce.assign("x", e);
					return parsedExpression.value;
				}),

				mode: "lines",
				marker: { color: "blue" },
			},
		];
	} else if (method === "newton_raphson") {
		if (!expression) {
			return 0;
		}

		const parsedExpression = ce.parse(expression);

		iterations = data?.iterations as FixedPointIteration[];
		const length = iterations.length;
		const xs: number[] = [];
		const ys: number[] = [];
		let f = 0;

		for (let i = 0; i < length; i++) {
			xs.push(iterations[i].x);
			ys.push(0);
			xs.push(iterations[i].x);
			ce.assign("x", iterations[i].x);
			f = parsedExpression.value as number;
			ys.push(f);
		}
		const min = Math.min(...xs);
		const max = Math.max(...xs);
		const arrRange = range(min - 2, max + 2, 0.01);

		return [
			{
				x: xs,
				y: ys,
				mode: "lines+marker",
				marker: { color: "red" },
			},
			{
				x: arrRange,
				y: arrRange.map((e) => {
					ce.assign("x", e);
					return parsedExpression.value;
				}),

				mode: "lines",
				marker: { color: "blue" },
			},
		];
	} else if (method === "secant") {
		if (!expression) {
			return 0;
		}

		const parsedExpression = ce.parse(expression);

		iterations = data?.iterations as FixedPointIteration[];
		const length = iterations.length;
		const result = [];
		const xs: number[] = [];

		let first_f = 0,
			second_f = 0;

		for (let i = 0; i < length - 1; i++) {
			xs.push(iterations[i].x);
			xs.push(iterations[i + 1].x);

			ce.assign("x", iterations[i].x);
			first_f = parsedExpression.value as number;

			ce.assign("x", iterations[i + 1].x);
			second_f = parsedExpression.value as number;

			result.push({
				x: [iterations[i].x, iterations[i + 1].x],
				y: [first_f, second_f],
				mode: "lines+marker",
				marker: { color: "red" },
			});

			result.push({
				x: [iterations[i].x, iterations[i].x],
				y: [0, first_f],
				mode: "lines",

				line: {
					dash: "dash",
					width: 2,
					color: "green",
				},
			});

			result.push({
				x: [iterations[i + 1].x, iterations[i + 1].x],
				y: [0, second_f],
				mode: "lines",

				line: {
					dash: "dash",
					width: 2,
					color: "green",
				},
			});
		}

		const min = Math.min(...xs);
		const max = Math.max(...xs);
		const arrRange = range(min - 2, max + 2, 0.01);

		result.push({
			x: arrRange,
			y: arrRange.map((e) => {
				ce.assign("x", e);
				return parsedExpression.value;
			}),

			mode: "lines",
			marker: { color: "blue" },
		});

		return result;
	}
};

export default getGraphData;
