import { Result, ResultKind } from '../result/types';

import { Ok, Err } from '../result/helpers';

import { safeFetch } from './fetch';
import { parseJson } from './parse_json';
import { catchResult, catchAsyncResult } from './helpers';


describe('js wrappers > helpers', () => {
	test('catchResult', () => {
		function throwsError(): void {
			throw new Error('1234');
		}
		expect(throwsError).toThrowError();

		function doesNotThrowError(): number {
			return 5;
		}
		expect(doesNotThrowError).not.toThrowError();

		expect(catchResult(throwsError)).toEqual(Err('Error: 1234'));
		expect(catchResult(doesNotThrowError)).toEqual(Ok(5));
	});

	test('catchAsyncResult', async () => {
		async function throwsError(): Promise<void> {
			throw new Error('1234');
		}
		expect(throwsError()).rejects.toEqual(new Error('1234'));

		async function doesNotThrowError(): Promise<number> {
			return 5;
		}
		expect(doesNotThrowError()).resolves.toEqual(5);

		expect(catchAsyncResult(throwsError))
			.resolves
			.toEqual(Err('Error: 1234'));
		expect(catchAsyncResult(doesNotThrowError))
			.resolves
			.toEqual(Ok(5));
	});
});

describe('js wrappers > parse_json', () => {
	test('parseJson', () => {
		const j1: string = '{';
		const res1: Result<number, string> = parseJson(j1);
		expect(res1.__kind).toEqual(ResultKind.Err);
		expect(res1.data).toEqual('SyntaxError: Unexpected end of JSON input');

		const j2: string = '{ "test": 2 }';
		const res2: Result<object, string> = parseJson(j2);
		expect(res2.__kind).toEqual(ResultKind.Ok);
		expect(res2.data).toEqual({ test: 2 });
	});
});

describe('js wrappers > fetch', () => {
	it('should return an error on invalid url call', () => {
		const fetched = safeFetch('asdf');
	});
});
