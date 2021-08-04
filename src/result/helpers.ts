import { Result, ResultKind, ResultOk, ResultErr } from './types';


/**
 * Generates an Ok Result<T, E>
 */
export function Ok<T, E>(data: T): Result<T, E> {
	return {
		__kind: ResultKind.Ok,
		data,
	};
}

/**
 * Generates an Err Result<T, E>
 */
export function Err<T, E>(data: E): Result<T, E> {
	return {
		__kind: ResultKind.Err,
		data,
	};
}

/**
 * Helps to determine if a result is Ok
 */
export function isOk<T, E>(result: Result<T, E>): result is ResultOk<T> {
	return result.__kind === ResultKind.Ok;
}

/**
 * Helps to determine if a result is Err
 */
export function isErr<T, E>(result: Result<T, E>): result is ResultErr<E> {
	return result.__kind === ResultKind.Err;
}
