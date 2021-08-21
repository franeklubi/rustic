import { RawJson } from './types';
import { Result } from './result/types';

import { Ok, Err } from './result/helpers';


/**
 * Turns any fallible function's output (T) info Result<T, string>.
 */
export function catchResult<T>(f: () => T): Result<T, string> {
	try {
		return Ok(f());
	} catch(e) {
		return Err(String(e));
	}
}

/**
 * Parses json, returning Result<T, string>.
 */
export function parseJson<T>(json: RawJson<T>): Result<T, string> {
	return catchResult(() => JSON.parse(json));
}
