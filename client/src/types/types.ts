import { LinearRequest, MatrixIterationRequest } from "./linear/requests";
import {
	CholeskyResult,
	CramerResult,
	GaussResult,
	InversionResult,
	LUResult,
	MatrixIterationResult,
} from "./linear/results";
import {
	BisectionRequest,
	FixedPointRequest,
	RootRequest,
	SecantRequest,
} from "./root/requests";
import { RootResult } from "./root/results";

export type RequestData =
	| RootRequest
	| BisectionRequest
	| FixedPointRequest
	| SecantRequest
	| LinearRequest
	| MatrixIterationRequest;

export type ErrorObject = {
	statusCode: string;
	message: string;
};

export type ResultData =
	| RootResult
	| CramerResult
	| GaussResult
	| InversionResult
	| LUResult
	| CholeskyResult
	| MatrixIterationResult
	| Error;
