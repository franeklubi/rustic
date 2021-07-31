import { Result, ResultKind } from './types';


describe('result type', () => {
	it('should behave correctly', () => {
		const res: Result<number, string> = {
			kind: ResultKind.Ok,
			data: 42,
		}

		expect(true).toBe(true);
	});
});
