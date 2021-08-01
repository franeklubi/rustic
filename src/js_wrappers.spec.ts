import { Result, ResultKind } from './result/types';

import { Ok, Err } from './result/helpers';
import { parseJson, catchResult } from './js_wrappers';


describe('js wrappers', () => {
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

	test('parseJson', () => {
		const j1: string = '{';
		const res1: Result<number, string> = parseJson(j1);
		expect(res1.kind).toEqual(ResultKind.Err);
		expect(res1.data).toEqual('SyntaxError: Unexpected end of JSON input');

		const j2: string = '{ "test": 2 }';
		const res2: Result<object, string> = parseJson(j2);
		expect(res2.kind).toEqual(ResultKind.Ok);
		expect(res2.data).toEqual({ test: 2 });
	});
});
