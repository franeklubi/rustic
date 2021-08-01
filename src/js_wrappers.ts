import { Result } from './result/types';
import { Ok, Err } from './result/helpers';


export function catchResult<T>(f: () => T): Result<T, string> {
	try {
		return Ok(f());
	} catch(e) {
		return Err(String(e));
	}
}

export function parseJson<T>(json: string): Result<T, string> {
	return catchResult(() => JSON.parse(json));
}
