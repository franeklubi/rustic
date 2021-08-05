import { Ok, Err } from '../result/helpers';

import { Result } from '../result/types';


/**
 * Turns any fallible function's output (T) into Result<T, string>.
 */
export function catchResult<T>(f: () => T): Result<T, string> {
	try {
		return Ok(f());
	} catch(e) {
		return Err(String(e));
	}
}

/**
 * Turns any async fallible function's output (T) into
 * Promise<Result<T, string>>.
 */
export async function catchAsyncResult<T>(
	f: () => Promise<T>,
): Promise<Result<T, string>> {
	try {
		return Ok(await f());
	} catch(e) {
		return Err(String(e));
	}
}
