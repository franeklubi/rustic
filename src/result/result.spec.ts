import { None } from '../option/consts';
import { Option } from '../option/types';
import { ResultEquipped } from './equipped';
import { Result, ResultKind } from './types';
import { OptionEquipped } from '../option/equipped';

import { equip } from '../helpers';
import { Ok, Err } from './helpers';


describe('result type', () => {
	test('isOk method', () => {
		const x1: ResultEquipped<number, string> = equip(Ok(-3));
		expect(x1.isOk()).toEqual(true);

		const x2: ResultEquipped<number, string>
			= equip(Err('Some error message'));
		expect(x2.isOk()).toEqual(false);
	});

	test('isErr method', () => {
		const x1: ResultEquipped<number, string> = equip(Ok(-3));
		expect(x1.isErr()).toEqual(false);

		const x2: ResultEquipped<number, string>
			= equip(Err('Some error message'));
		expect(x2.isErr()).toEqual(true);
	});

	test('contains method', () => {
		const x1: ResultEquipped<number, string> = equip(Ok(2));
		expect(x1.contains(2)).toEqual(true);

		const x2: ResultEquipped<number, string> = equip(Ok(3));
		expect(x2.contains(2)).toEqual(false);

		const x3: ResultEquipped<number, string>
			= equip(Err('Some error message'));
		expect(x3.contains(2)).toEqual(false);
	});

	test('containsErr method', () => {
		const x1: ResultEquipped<number, string> = equip(Ok(2));
		expect(x1.containsErr('Some error message')).toEqual(false);

		const x2: ResultEquipped<number, string>
			= equip(Err('Some error message'));
		expect(x2.containsErr('Some error message')).toEqual(true);

		const x3: ResultEquipped<number, string>
			= equip(Err('Some other error message'));
		expect(x3.containsErr('Some error message')).toEqual(false);
	});

	test('ok method', () => {
		const x1: ResultEquipped<number, string> = equip(Ok(2));
		expect(x1.ok().inner).toEqual(2);

		const x2: ResultEquipped<number, string> = equip(Err('Nothing here'));
		expect(x2.ok().inner).toEqual(None);
	});

	test('err method', () => {
		const x1: ResultEquipped<number, string> = equip(Ok(2));
		expect(x1.err().inner).toEqual(None);

		const x2: ResultEquipped<number, string> = equip(Err('Nothing here'));
		expect(x2.err().inner).toEqual('Nothing here');
	});

	test('map method', () => {
		function stringize(a: number): string {
			return String(a);
		}

		const from1: Result<number, string> = Ok(4);
		const target1: Result<string, string> = Ok('4');
		expect(equip(from1).map(stringize).inner).toEqual(target1);

		const from2: Result<number, string> = Err('Test');
		const target2: Result<string, string> = Err('Test');
		expect(equip(from2).map(stringize).inner).toEqual(target2);
	});

	test('mapErr method', () => {
		function numberize(a: string): number {
			return Number(a);
		}

		const from1: Result<string, string> = Ok('Test');
		const target1: Result<string, number> = Ok('Test');
		expect(equip(from1).mapErr(numberize).inner).toEqual(target1);

		const from2: Result<string, string> = Err('4');
		const target2: Result<string, number> = Err(4);
		expect(equip(from2).mapErr(numberize).inner).toEqual(target2);
	});

	test('mapOr method', () => {
		const x1: ResultEquipped<string, string> = equip(Ok('foo'));
		expect(x1.mapOr(42, v => v.length)).toEqual(3);

		const x2: ResultEquipped<string, string> = equip(Err('bar'));
		expect(x2.mapOr(42, v => v.length)).toEqual(42);
	});

	test('mapOrElse method', () => {
		const x1: ResultEquipped<string, string> = equip(Ok('foo'));
		expect(x1.mapOrElse(() => 42, v => v.length)).toEqual(3);

		const x2: ResultEquipped<string, string> = equip(Err('bar'));
		expect(x2.mapOrElse(() => 42, v => v.length)).toEqual(42);
	});

	test('and method', () => {
		const x1: Result<number, string> = Ok(2);
		const y1: Result<string, string> = Err('late error');
		expect(equip(x1).and(y1).inner).toEqual(Err('late error'));

		const x2: Result<number, string> = Err('early error');
		const y2: Result<string, string> = Ok('foo');
		expect(equip(x2).and(y2).inner).toEqual(Err('early error'));

		const x3: Result<number, string> = Err('not a 2');
		const y3: Result<string, string> = Err('late error');
		expect(equip(x3).and(y3).inner).toEqual(Err('not a 2'));

		const x4: Result<number, string> = Ok(2);
		const y4: Result<string, string> = Ok('different result type');
		expect(equip(x4).and(y4).inner).toEqual(Ok('different result type'));
	});

	test('andThen method', () => {
		const x1: Result<number, string> = Ok(2);
		const y1: Result<string, string> = Err('late error');
		expect(equip(x1).andThen(() => y1).inner).toEqual(Err('late error'));

		const x2: Result<number, string> = Err('early error');
		const y2: Result<string, string> = Ok('foo');
		expect(equip(x2).andThen(() => y2).inner).toEqual(Err('early error'));

		const x3: Result<number, string> = Err('not a 2');
		const y3: Result<string, string> = Err('late error');
		expect(equip(x3).andThen(() => y3).inner).toEqual(Err('not a 2'));

		const x4: Result<number, string> = Ok(2);
		const y4: Result<string, string> = Ok('different result type');
		expect(equip(x4).andThen(() => y4).inner)
			.toEqual(Ok('different result type'));
	});

	test('or method', () => {
		const x1: Result<number, string> = Ok(2);
		const y1: Result<number, string> = Err('late error');
		expect(equip(x1).or(y1).inner).toEqual(Ok(2));

		const x2: Result<number, string> = Err('early error');
		const y2: Result<number, string> = Ok(2);
		expect(equip(x2).or(y2).inner).toEqual(Ok(2));

		const x3: Result<number, string> = Err('not a 2');
		const y3: Result<number, string> = Err('late error');
		expect(equip(x3).or(y3).inner).toEqual(Err('late error'));

		const x4: Result<number, string> = Ok(2);
		const y4: Result<number, string> = Ok(100);
		expect(equip(x4).or(y4).inner).toEqual(Ok(2));
	});

	test('orElse method', () => {
		const x1: Result<number, string> = Ok(2);
		const y1: Result<number, string> = Err('late error');
		expect(equip(x1).orElse(() => y1).inner).toEqual(Ok(2));

		const x2: Result<number, string> = Err('early error');
		const y2: Result<number, string> = Ok(2);
		expect(equip(x2).orElse(() => y2).inner).toEqual(Ok(2));

		const x3: Result<number, string> = Err('not a 2');
		const y3: Result<number, string> = Err('late error');
		expect(equip(x3).orElse(() => y3).inner).toEqual(Err('late error'));

		const x4: Result<number, string> = Ok(2);
		const y4: Result<number, string> = Ok(100);
		expect(equip(x4).orElse(() => y4).inner).toEqual(Ok(2));
	});

	test('unwrap method', () => {
		const x1: Result<number, string> = Ok(2);
		expect(equip(x1).unwrap()).toEqual(2);

		const x2: Result<number, string> = Err('emergency failure');
		expect(() => equip(x2).unwrap()).toThrowError();
	});

	test('unwrapErr method', () => {
		const x1: Result<number, string> = Err('emergency failure');
		expect(equip(x1).unwrapErr()).toEqual('emergency failure');

		const x2: Result<number, string> = Ok(2);
		expect(() => equip(x2).unwrapErr()).toThrowError();
	});

	test('unwrapOr method', () => {
		const d = 2;
		const x1: Result<number, string> = Ok(9);
		expect(equip(x1).unwrapOr(d)).toEqual(9);

		const x2: Result<number, string> = Err("error");
		expect(equip(x2).unwrapOr(d)).toEqual(d);
	});

	test('unwrapOrElse method', () => {
		const d = 2;
		const x1: Result<number, string> = Ok(9);
		expect(equip(x1).unwrapOrElse(() => d)).toEqual(9);

		const x2: Result<number, string> = Err("error");
		expect(equip(x2).unwrapOrElse(() => d)).toEqual(d);
	});

	test('expect method', () => {
		const x1: Result<number, string> = Ok(4);
		expect(equip(x1).expect("Testing expect")).toEqual(4);

		const x2: Result<number, string> = Err("emergency failure");
		expect(() => equip(x2).expect("Testing expect")).toThrowError();
	});

	test('expectErr method', () => {
		const x1: Result<number, string> = Err("emergency failure");
		expect(equip(x1).expectErr("Testing expectErr"))
			.toEqual("emergency failure");

		const x2: Result<number, string> = Ok(4);
		expect(() => equip(x2).expectErr("Testing expectErr")).toThrowError();
	});

	test('transpose method', () => {
		type SomeErr = 1234;

		// Ok ResultEquipped of Some Option
		const x1: ResultEquipped<Option<number>, SomeErr> = equip(Ok(5));
		const y1: OptionEquipped<Result<number, SomeErr>>
			= new OptionEquipped(Ok(5));
		expect(x1.transpose()).toEqual(y1);

		// Ok ResultEquipped of None Option
		const x2: ResultEquipped<Option<number>, SomeErr> = equip(Ok(None));
		const y2: OptionEquipped<Result<number, SomeErr>>
			= new OptionEquipped<Result<number, SomeErr>>(None);
		expect(x2.transpose()).toEqual(y2);

		// Err ResultEquipped
		const x3: ResultEquipped<Option<number>, SomeErr> = equip(Err(1234));
		const y3: OptionEquipped<Result<number, SomeErr>>
			= new OptionEquipped(Err(1234));
		expect(x3.transpose()).toEqual(y3);

		// Err Result
		const x4: Result<Option<number>, SomeErr> = Err(1234);
		const y4: OptionEquipped<Result<number, SomeErr>>
			= new OptionEquipped(Err(1234));
		expect(equip(x4).transpose()).toEqual(y4);
	});

	test('flatten method', () => {
		let x1: Result<string, number> = Ok("hello");
		expect(equip(x1).flatten().inner).toEqual(Ok("hello"));

		let x2: Result<Result<string, number>, number> = Ok(Ok("hello"));
		expect(equip(x2).flatten().inner).toEqual(Ok("hello"));

		let x3: Result<ResultEquipped<string, number>, number>
			= Ok(equip(Ok("hello")));
		expect(equip(x3).flatten().inner).toEqual(Ok("hello"));

		let x4: Result<Result<string, number>, number> = Ok(Err(6));
		expect(equip(x4).flatten().inner).toEqual(Err(6));

		let x5: Result<Result<string, number>, number> = Err(6);
		expect(equip(x5).flatten().inner).toEqual(Err(6));

		let x6: Result<Result<Result<string, number>, number>, number>
			= Ok(Ok(Ok("hello")));
		expect(equip(x6).flatten().inner).toEqual(Ok(Ok("hello")));
		expect(equip(x6).flatten().flatten().inner).toEqual(Ok("hello"));
	});
});
