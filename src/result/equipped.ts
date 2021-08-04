import { Ok, Err } from './helpers';
import { panic } from '../helpers';

import { Inner } from '../option/types';
import { Result, ResultKind } from './types';
import { OptionEquipped } from '../option/equipped';

import { None } from '../option/consts';

/**
 * Wrapper for Result<T, E> containing all methods (that make sense)
 * from Rust's Result<T, E>
 */
export class ResultEquipped<T, E> {
	private _res: Result<T, E>;

	constructor(res: Result<T, E>) {
		this._res = res;
	}

	get inner(): Result<T, E> {
		return this._res;
	}

	get __kind(): ResultKind {
		return this._res.__kind;
	}

	get data(): T | E {
		return this._res.data;
	}

	isOk(): boolean {
		return this._res.__kind === ResultKind.Ok;
	}

	isErr(): boolean {
		return this._res.__kind === ResultKind.Err;
	}

	contains(value: T): boolean {
		if (this._res.__kind === ResultKind.Ok) {
			return this._res.data === value;
		} else {
			return false;
		}
	}

	containsErr(value: E): boolean {
		if (this._res.__kind === ResultKind.Err) {
			return this._res.data === value;
		} else {
			return false;
		}
	}

	ok(): OptionEquipped<T> {
		if (this._res.__kind === ResultKind.Ok) {
			return new OptionEquipped(this._res.data);
		} else {
			return new OptionEquipped<T>(None);
		}
	}

	err(): OptionEquipped<E> {
		if (this._res.__kind === ResultKind.Err) {
			return new OptionEquipped(this._res.data);
		} else {
			return new OptionEquipped<E>(None);
		}
	}

	map<U>(f: (a: T) => U): ResultEquipped<U, E> {
		if (this._res.__kind === ResultKind.Ok) {
			return new ResultEquipped<U, E>(Ok(f(this._res.data)));
		} else {
			return this as unknown as ResultEquipped<U, E>;
		}
	}

	mapErr<F>(f: (a: E) => F): ResultEquipped<T, F> {
		if (this._res.__kind === ResultKind.Err) {
			return new ResultEquipped<T, F>(Err(f(this._res.data)));
		} else {
			return this as unknown as ResultEquipped<T, F>;
		}
	}

	mapOr<U>(d: U, f: (a: T) => U): U {
		if (this._res.__kind === ResultKind.Ok) {
			return f(this._res.data);
		} else {
			return d;
		}
	}

	mapOrElse<U>(df: () => U, mf: (a: T) => U): U {
		if (this._res.__kind === ResultKind.Ok) {
			return mf(this._res.data);
		} else {
			return df();
		}
	}

	and<U>(res: Result<U, E>): ResultEquipped<U, E> {
		if (this._res.__kind === ResultKind.Ok) {
			return new ResultEquipped(res);
		} else {
			return this as unknown as ResultEquipped<U, E>;
		}
	}

	andThen<U>(f: (a: T) => Result<U, E>): ResultEquipped<U, E> {
		if (this._res.__kind === ResultKind.Ok) {
			return new ResultEquipped(f(this._res.data));
		} else {
			return this as unknown as ResultEquipped<U, E>;
		}
	}

	or<F>(res: Result<T, F>): ResultEquipped<T, F> {
		if (this._res.__kind === ResultKind.Err) {
			return new ResultEquipped<T, F>(res);
		} else {
			return this as unknown as ResultEquipped<T, F>;
		}
	}

	orElse<F>(f: (a: E) => Result<T, F>): ResultEquipped<T, F> {
		if (this._res.__kind === ResultKind.Err) {
			return new ResultEquipped(f(this._res.data));
		} else {
			return this as unknown as ResultEquipped<T, F>;
		}
	}

	unwrap(): T {
		if (this._res.__kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return panic(
				`called ResultEquipped.unwrap() on an \`Err\` value ${
					JSON.stringify(this._res.data)
				}`,
			);
		}
	}

	unwrapErr(): E {
		if (this._res.__kind === ResultKind.Err) {
			return this._res.data;
		} else {
			return panic(
				`called ResultEquipped.unwrapErr() on an \`Ok\` value: ${
					JSON.stringify(this._res.data)
				}`,
			);
		}
	}

	unwrapOr(d: T): T {
		if (this._res.__kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return d;
		}
	}

	unwrapOrElse(f: () => T): T {
		if (this._res.__kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return f();
		}
	}

	expect(msg: string): T {
		if (this._res.__kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return panic(`${msg}: ${JSON.stringify(this._res.data)}`);
		}
	}

	expectErr(msg: string): E {
		if (this._res.__kind === ResultKind.Err) {
			return this._res.data;
		} else {
			return panic(`${msg}: ${JSON.stringify(this._res.data)}`);
		}
	}

	transpose<I extends Inner<T>>(): OptionEquipped<ResultEquipped<I, E>> {
		if (this._res.__kind === ResultKind.Ok) {
			if (this._res.data == null) {
				return new OptionEquipped<ResultEquipped<I, E>>(None);
			} else {
				return new OptionEquipped<ResultEquipped<I, E>>(
					new ResultEquipped(Ok(this._res.data as I)),
				);
			}
		} else {
			return new OptionEquipped(
				new ResultEquipped<I, E>(Err(this._res.data)),
			);
		}
	}

	flatten(): ResultEquipped<T, E> {
		// Assuming that data held is of result-ish type...
		const value: Result<T, E> = this._res.data as unknown as Result<T, E>;

		// ...but making sure it really is
		if (value.__kind == null) {
			return this;
		}

		return new ResultEquipped({
			__kind: value.__kind,
			data: value.data,
		} as Result<T, E>);
	}
}
