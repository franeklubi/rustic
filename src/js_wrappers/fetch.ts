import { equip } from '../helpers';
import { Ok, Err } from '../result/helpers';
import { catchResult, catchAsyncResult } from './helpers';

import { Result, ResultKind } from '../result/types';
import { SafeResponse, SafeFetchError } from './types';


export async function safeFetch(
	input: RequestInfo,
	init?: RequestInit,
): Promise<Result<SafeResponse, SafeFetchError>> {
	// Catching async error
	let response: Response;
	try {
		response = await fetch(input, init);
	} catch(e) {
		return Err({
			response: null,
			message: String(e),
		});
	}

	const safetied: SafeResponse = {
		// Copies
		body: response.body,
		bodyUsed: response.bodyUsed,
		headers: response.headers,
		ok: response.ok,
		redirected: response.redirected,
		status: response.status,
		statusText: response.statusText,
		type: response.type,
		url: response.url,
		clone: response.clone,

		// Safetied
		trailer: catchAsyncResult(() => response.trailer),
		arrayBuffer: () => catchAsyncResult(response.arrayBuffer),
		blob: () => catchAsyncResult(response.blob),
		formData: () => catchAsyncResult(response.formData),
		json: () => catchAsyncResult(response.json),
		text: () => catchAsyncResult(response.text),
	};

	return Ok(safetied);
}
