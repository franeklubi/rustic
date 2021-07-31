import { Result, ResultKind } from './result';


describe('result type', () => {
	it('should behave correctly', () => {
		const res: Result<number, string> = {
			kind: ResultKind.Ok,
			data: 42,
		}

		expect(true).toBe(true);
	});
});
