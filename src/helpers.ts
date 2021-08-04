import { Result } from './result/types';
import { Option } from './option/types';
import { ResultEquipped } from './result/equipped';
import { OptionEquipped } from './option/equipped';


export function unimplemented(msg?: string): any {
	return panic(`not implemented${msg == null ? '' : ': ' + msg}`);
}

export function todo(msg?: string): any {
	return panic(`not yet implemented${msg == null ? '' : ': ' + msg}`);
}

export function panic(msg?: string): any {
	throw new Error(`panicked at '${msg == null ? 'explicit panic' : msg}'`);
}

export function equip<T, E>(r: Result<T, E>): ResultEquipped<T, E>;
export function equip<T>(r: Option<T>): OptionEquipped<T>;
export function equip(v: any) {
	if ((v as Result<any, any>)?.__kind != null) {
		return new ResultEquipped(v);
	} else {
		return new OptionEquipped(v);
	}
}
