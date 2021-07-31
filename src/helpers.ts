import { Result } from './result/types';
import { ResultEquipped } from './result/equipped';


// TODO: use map in whole file when option is implemented

export function unimplemented(msg?: string): any {
	return panic(`not implemented${msg == null ? '' : ': ' + msg}`);
}

export function todo(msg?: string): any {
	return panic(`not yet implemented${msg == null ? '' : ': ' + msg}`);
}

export function panic(msg?: string): any {
	throw new Error(`panicked at '${msg == null ? 'explicit panic' : msg}'`);
}

// TODO: implement `equip` for Option
export function equip<T, E>(r: Result<T, E>): ResultEquipped<T, E>;
export function equip<O>(r: O): { inner: O };
export function equip(v: any) {
	if (v.kind != null) {
		return new ResultEquipped(v);
	} else {
		return todo('Option');
	}
}
