import { todo, panic } from '../helpers';
import { Ok, Err } from './helpers';

import { Result, ResultKind } from './types';
import { OptionEquipped } from '../option/equipped';


export class ResultEquipped<T, E> {
	private _res: Result<T, E>;

	constructor(res: Result<T, E>) {
		this._res = res;
	}

	get result(): Result<T, E> {
		return this._res;
	}

	isOk(): boolean {
		return this._res.kind === ResultKind.Ok;
	}

	isErr(): boolean {
		return this._res.kind === ResultKind.Err;
	}

	contains(value: T): boolean {
		if (this._res.kind === ResultKind.Ok) {
			return this._res.data === value;
		} else {
			return false;
		}
	}

	containsErr(value: E): boolean {
		if (this._res.kind === ResultKind.Err) {
			return this._res.data === value;
		} else {
			return false;
		}
	}

	ok(): OptionEquipped<T> {
		if (this._res.kind === ResultKind.Ok) {
			return new OptionEquipped(this._res.data);
		} else {
			return new OptionEquipped<T>(null);
		}
	}

	err(): OptionEquipped<E> {
		if (this._res.kind === ResultKind.Err) {
			return new OptionEquipped(this._res.data);
		} else {
			return new OptionEquipped<E>(null);
		}
	}

	map<U>(f: (a: T) => U): ResultEquipped<U, E> {
		if (this._res.kind === ResultKind.Ok) {
			return new ResultEquipped(Ok(f(this._res.data)));
		} else {
			return this as unknown as ResultEquipped<U, E>;
		}
	}

	mapErr<F>(f: (a: E) => F): ResultEquipped<T, F> {
		if (this._res.kind === ResultKind.Err) {
			return new ResultEquipped(Err(f(this._res.data)));
		} else {
			return this as unknown as ResultEquipped<T, F>;
		}
	}

	mapOr<U>(f: (a: T) => U, d: U): U {
		if (this._res.kind === ResultKind.Ok) {
			return f(this._res.data);
		} else {
			return d;
		}
	}

	mapOrElse<U>(mf: (a: T) => U, df: () => U): U {
		if (this._res.kind === ResultKind.Ok) {
			return mf(this._res.data);
		} else {
			return df();
		}
	}

	and(res: Result<T, E>): ResultEquipped<T, E> {
		if (this._res.kind === ResultKind.Ok) {
			return new ResultEquipped(res);
		} else {
			return this;
		}
	}

	andThen(f: (a: T) => Result<T, E>): ResultEquipped<T, E> {
		if (this._res.kind === ResultKind.Ok) {
			return new ResultEquipped(f(this._res.data));
		} else {
			return this;
		}
	}

	or<F>(res: Result<T, F>): ResultEquipped<T, F> {
		if (this._res.kind === ResultKind.Err) {
			return new ResultEquipped<T, F>(res);
		} else {
			return this as unknown as ResultEquipped<T, F>;
		}
	}

	orElse<F>(f: (a: E) => Result<T, F>): ResultEquipped<T, F> {
		if (this._res.kind === ResultKind.Err) {
			return new ResultEquipped(f(this._res.data));
		} else {
			return this as unknown as ResultEquipped<T, F>;
		}
	}

	unwrap(): T {
		if (this._res.kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return panic(
				`called ResultEquipped.unwrap() on an \`Err\` value ${
					JSON.stringify(this._res.data)
				}`
			);
		}
	}

	unwrapErr(): E {
		if (this._res.kind === ResultKind.Err) {
			return this._res.data;
		} else {
			return panic(
				`called ResultEquipped.unwrapErr() on an \`Ok\` value: ${
					JSON.stringify(this._res.data)
				}`
			);
		}
	}

	unwrapOr(d: T): T {
		if (this._res.kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return d;
		}
	}

	unwrapOrElse(f: () => T): T {
		if (this._res.kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return f();
		}
	}

	expect(msg: string): T {
		if (this._res.kind === ResultKind.Ok) {
			return this._res.data;
		} else {
			return panic(`${msg}: ${JSON.stringify(this._res.data)}`);
		}
	}

	expectErr(msg: string): E {
		if (this._res.kind === ResultKind.Err) {
			return this._res.data;
		} else {
			return panic(`${msg}: ${JSON.stringify(this._res.data)}`);
		}
	}

	transpose(): void {
		todo('When option gets there');
	}

	flatten(): Result<T, E> {
		return todo('idk later');
	}
}
