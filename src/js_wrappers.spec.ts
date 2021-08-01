import { Result, ResultKind } from './result/types';

import { parseJson } from './js_wrappers';


describe('js wrappers', () => {
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
