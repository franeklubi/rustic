import { Option } from './types';
import { ResultEquipped } from '../result/equipped';
import { Result, ResultKind } from '../result/types';

import { panic } from '../helpers';
import { Ok, Err } from '../result/helpers';

import { None } from './consts';


export class OptionEquipped<T> {
	private _opt: Option<T>;

	constructor(opt: Option<T>) {
		this._opt = opt;
	}

	get inner(): Option<T> {
		return this._opt;
	}

	and<U>(optb: Option<U>): OptionEquipped<U> {
		if (this._opt == null) {
			return this as unknown as OptionEquipped<U>;
		} else {
			return new OptionEquipped<U>(optb);
		}
	}

	andThen<U>(f: (a: T) => Option<U>): OptionEquipped<U> {
		if (this._opt == null) {
			return this as unknown as OptionEquipped<U>;
		} else {
			return new OptionEquipped<U>(f(this._opt));
		}
	}

	contains(value: T): boolean {
		return this._opt === value;
	}

	expect(msg: string): T {
		if (this._opt == null) {
			return panic(`${msg}`);
		} else {
			return this._opt;
		}
	}

	filter(f: (a: T) => boolean): OptionEquipped<T> {
		if (this._opt == null) {
			return this;
		} else if (f(this._opt)) {
			return this;
		} else {
			return new OptionEquipped<T>(None);
		}
	}

	getOrInsert(value: T): T {
		if (this._opt == null) {
			return this._opt = value;
		} else {
			return this._opt;
		}
	}

	getOrInsertWith(f: () => T): T {
		if (this._opt == null) {
			return this._opt = f();
		} else {
			return this._opt;
		}
	}

	insert(value: T): T {
		return this._opt = value;
	}

	isNone(): boolean {
		return this._opt == null;
	}

	isSome(): boolean {
		return this._opt != null;
	}

	map<U>(f: (a: T) => Option<U>): OptionEquipped<U> {
		if (this._opt == null) {
			return this as unknown as OptionEquipped<U>;
		} else {
			return new OptionEquipped(f(this._opt));
		}
	}

	mapOr<U>(d: U, f: (a: T) => Option<U>): OptionEquipped<U> {
		if (this._opt == null) {
			return new OptionEquipped(d);
		} else {
			return new OptionEquipped(f(this._opt));
		}
	}

	mapOrElse<U>(df: () => U, mf: (a: T) => Option<U>): OptionEquipped<U> {
		if (this._opt == null) {
			return new OptionEquipped(df());
		} else {
			return new OptionEquipped(mf(this._opt));
		}
	}

	okOr<E>(err: E): ResultEquipped<T, E> {
		if (this._opt == null) {
			return new ResultEquipped<T, E>(Err(err));
		} else {
			return new ResultEquipped<T, E>(Ok(this._opt));
		}
	}

	okOrElse<E>(f: () => E): ResultEquipped<T, E> {
		if (this._opt == null) {
			return new ResultEquipped<T, E>(Err(f()));
		} else {
			return new ResultEquipped<T, E>(Ok(this._opt));
		}
	}

	or(optb: Option<T>): OptionEquipped<T> {
		if (this._opt == null) {
			return new OptionEquipped(optb);
		} else {
			return this;
		}
	}

	orElse(f: () => Option<T>): OptionEquipped<T> {
		if (this._opt == null) {
			return new OptionEquipped(f());
		} else {
			return this;
		}
	}

	replace(value: T): OptionEquipped<T> {
		const oldValue = this._opt;

		this._opt = value;

		return new OptionEquipped(oldValue);
	}

	take(): OptionEquipped<T> {
		const oldValue = this._opt;

		this._opt = None;

		return new OptionEquipped(oldValue);
	}

	transpose<E>(): ResultEquipped<OptionEquipped<T>, E> {
		const value = this._opt as Option<Result<T, E> | ResultEquipped<T, E>>;

		if (value == null) {
			return new ResultEquipped<OptionEquipped<T>, E>(
				Ok(new OptionEquipped<T>(None)),
			);
		} else {
			if (value.__kind === ResultKind.Ok) {
				return new ResultEquipped<OptionEquipped<T>, E>(
					Ok(new OptionEquipped<T>(value.data as T)),
				);
			} else {
				return new ResultEquipped<OptionEquipped<T>, E>(
					Err(value.data as E),
				);
			}
		}
	}

	unwrap(): T {
		if (this._opt == null) {
			return panic('called OptionEquipped.unwrap() on a `None` value');
		} else {
			return this._opt;
		}
	}

	unwrapOr(d: T): T {
		return this._opt ?? d;
	}

	unwrapOrElse(f: () => T): T {
		return this._opt ?? f();
	}

	xor(optb: Option<T>): OptionEquipped<T> {
		if (this._opt == null && optb != null) {
			return new OptionEquipped(optb);
		} else if (this._opt != null && optb == null) {
			return this;
		} else {
			return new OptionEquipped<T>(None);
		}
	}

	zip<U>(optb: Option<U>): OptionEquipped<[T, U]> {
		if (this._opt == null || optb == null) {
			return new OptionEquipped<[T, U]>(None);
		} else {
			return new OptionEquipped([this._opt, optb]);
		}
	}

	zipWith<U, R>(optb: Option<U>, f: (a: T, b: U) => R): OptionEquipped<R> {
		if (this._opt == null || optb == null) {
			return new OptionEquipped<R>(None);
		} else {
			return new OptionEquipped(f(this._opt, optb));
		}
	}
}
