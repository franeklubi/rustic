import { equip } from '../helpers';
import { Ok, Err } from '../result/helpers';
import { catchResult, catchAsyncResult } from './helpers';

import { Result, ResultKind } from '../result/types';
import { SafeResponse, SafeFetchError } from './types';


export async function safeFetch(
	input: RequestInfo,
	init?: RequestInit,
): Promise<Result<SafeResponse, string>> {
	// Catching async error
	const caught = await catchAsyncResult(() => fetch(input, init));

	// Mapping the result from Response into SafeResponse
	return equip(caught).map((res: Response) => {
		return {
			// Copies
			body: res.body,
			bodyUsed: res.bodyUsed,
			headers: res.headers,
			ok: res.ok,
			redirected: res.redirected,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
			url: res.url,
			clone: res.clone,

			// Safetied
			trailer: catchAsyncResult(() => res.trailer),
			arrayBuffer: () => catchAsyncResult(res.arrayBuffer),
			blob: () => catchAsyncResult(res.blob),
			formData: () => catchAsyncResult(res.formData),
			json: () => catchAsyncResult(res.json),
			text: () => catchAsyncResult(res.text),
		};
	}).inner;
}
