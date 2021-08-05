import { catchResult } from './helpers';
import { Ok, Err } from '../result/helpers';

import { Result } from '../result/types';


/**
 * Parses json, returning Result<T, string>.
 */
export function parseJson<T>(json: string): Result<T, string> {
	return catchResult(() => JSON.parse(json));
}
