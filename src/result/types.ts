
export enum ResultKind {
	Ok,
	Err,
}

export interface ResultOk<T> {
	kind: ResultKind.Ok;
	data: T;
}

export interface ResultErr<E> {
	kind: ResultKind.Err;
	data: E;
}

export type Result<T, E> = ResultOk<T> | ResultErr<E>;
