import { Result, ResultKind, ResultOk, ResultErr } from './types';


export function Ok<T, E>(data: T): Result<T, E> {
	return {
		__kind: ResultKind.Ok,
		data,
	};
}

export function Err<T, E>(data: E): Result<T, E> {
	return {
		__kind: ResultKind.Err,
		data,
	};
}

export function isOk<T, E>(result: Result<T, E>): result is ResultOk<T> {
	return result.__kind === ResultKind.Ok;
}

export function isErr<T, E>(result: Result<T, E>): result is ResultErr<E> {
	return result.__kind === ResultKind.Err;
}
