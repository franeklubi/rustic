
export enum ResultKind {
	Ok,
	Err,
}

export interface ResultOk<T> {
	__kind: ResultKind.Ok;
	data: T;
}

export interface ResultErr<E> {
	__kind: ResultKind.Err;
	data: E;
}

export type Result<T, E> = ResultOk<T> | ResultErr<E>;
