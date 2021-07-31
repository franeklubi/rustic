import { ResultEquipped } from './equipped';
import { Result, ResultKind } from './types';


export function Ok<T, E>(data: T): Result<T, E> {
	return {
		kind: ResultKind.Ok,
		data,
	};
}

export function Err<T, E>(data: E): Result<T, E> {
	return {
		kind: ResultKind.Err,
		data,
	};
}
