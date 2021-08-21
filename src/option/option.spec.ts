import { equip } from '../helpers';
import { Ok, Err, isErr } from '../result/helpers';
import { parseJson } from '../js_wrappers/js_wrappers';

import { Option } from './types';
import { OptionEquipped } from './equipped';
import { RawJson } from '../js_wrappers/types';
import { ResultEquipped } from '../result/equipped';
import { Result, ResultKind } from '../result/types';

import { None } from './consts';


describe('Option<T>', () => {
	test('and method', () => {
		const x1: Option<number> = 2;
		const y1: Option<string> = None;
		const res1: Option<string> = equip(x1).and(y1).inner;
		expect(res1).toEqual(None);

		const x2: Option<number> = None;
		const y2: Option<string> = "foo";
		const res2: Option<string> = equip(x2).and(y2).inner;
		expect(res2).toEqual(None);

		const x3 = 2;
		const y3 = "foo";
		const res3: Option<string> = equip(x3).and(y3).inner;
		expect(res3).toEqual("foo");

		const x4: Option<number> = None;
		const y4: Option<string> = None;
		const res4: Option<string> = equip(x4).and(y4).inner;
		expect(res4).toEqual(None);
	});

	test('andThen method', () => {
		function sq(x: number): Option<number> { return x * x };
		function nope(_: number): Option<number> { return None };

		expect(equip(2).andThen(sq).andThen(sq).inner).toEqual(16);
		expect(equip(2).andThen(sq).andThen(nope).inner).toEqual(None);
		expect(equip(2).andThen(nope).andThen(sq).inner).toEqual(None);
		expect(
			equip(None as Option<number>)
				.andThen(sq)
				.andThen(sq)
				.inner,
		).toEqual(None);
	});

	test('contains method', () => {
		const x1: Option<number> = 2;
		expect(equip(x1).contains(2)).toEqual(true);

		const x2: Option<number> = 3;
		expect(equip(x2).contains(2)).toEqual(false);

		const x3: Option<number> = None as Option<number>;
		expect(equip(x3).contains(2)).toEqual(false);
	});

	test('expect method', () => {
		const x1: Option<string> = "value";
		expect(equip(x1).expect("fruits are healthy")).toEqual("value");

		const x2: Option<string> = None;
		expect(() => equip(x2).expect("fruits are healthy")).toThrowError();
	});

	test('filter method', () => {
		function isEven(n: number): boolean { return n % 2 == 0 };

		expect(
			equip(None as Option<number>)
				.filter(isEven)
				.inner,
		).toEqual(None);
		expect(equip(3).filter(isEven).inner).toEqual(None);
		expect(equip(4).filter(isEven).inner).toEqual(4);
	})

	test('getOrInsert method', () => {
		const x1: OptionEquipped<number> = equip(None as Option<number>);

		const y1: number = x1.getOrInsert(5);
		expect(y1).toEqual(5);

		const x2: OptionEquipped<number> = equip(4);

		const y2: number = x2.getOrInsert(5);
		expect(y2).toEqual(4);
	});

	test('getOrInsertWith method', () => {
		const x1: OptionEquipped<number> = equip(None as Option<number>);

		const y1: number = x1.getOrInsertWith(() => 5);
		expect(y1).toEqual(5);

		const x2: OptionEquipped<number> = equip(4);

		const y2: number = x2.getOrInsertWith(() => 5);
		expect(y2).toEqual(4);
	});

	test('insert method', () => {
		const opt: OptionEquipped<number> = equip(None as Option<number>);
		const val = opt.insert(1);
		expect(val).toEqual(1);
		expect(opt.unwrap()).toEqual(1);
	});

	test('isNone method', () => {
		const x1: Option<number> = 2;
		expect(equip(x1).isNone()).toEqual(false);

		const x2: Option<number> = None;
		expect(equip(x2).isNone()).toEqual(true);
	});

	test('isSome method', () => {
		const x1: Option<number> = 2;
		expect(equip(x1).isSome()).toEqual(true);

		const x2: Option<number> = None;
		expect(equip(x2).isSome()).toEqual(false);
	});

	test('map method', () => {
		const maybeSomeString1: OptionEquipped<string> = equip('hello, world!');
		const maybeSomeLen1: Option<number>
			= maybeSomeString1.map((s) => s.length).inner;

		expect(maybeSomeLen1).toEqual(13);

		const maybeSomeString2: OptionEquipped<string>
			= equip(None as Option<string>);
		const maybeSomeLen2: Option<number>
			= maybeSomeString2.map((s) => s.length).inner;

		expect(maybeSomeLen2).toEqual(None);
	});

	test('mapOr method', () => {
		const x1: OptionEquipped<string> = equip("foo");
		expect(x1.mapOr(42, (v) => v.length).inner).toEqual(3);

		const x2: OptionEquipped<string> = equip(None as Option<string>);
		expect(x2.mapOr(42, (v) => v.length).inner).toEqual(42);
	});

	test('mapOrElse method', () => {
		const k = 21;

		const x1: OptionEquipped<string> = equip("foo");
		expect(x1.mapOrElse(() => 2 * k, (v) => v.length).inner).toEqual(3);

		const x2: OptionEquipped<string> = equip(None as Option<string>);
		expect(x2.mapOrElse(() => 2 * k, (v) => v.length).inner).toEqual(42);
	});

	test('okOr method', () => {
		const x1: OptionEquipped<string> = equip("foo");
		expect(x1.okOr(0).inner).toEqual(Ok("foo"));

		const x2: OptionEquipped<string> = equip(None as Option<string>);
		expect(x2.okOr(0).inner).toEqual(Err(0));
	});

	test('okOrElse method', () => {
		const x1: OptionEquipped<string> = equip("foo");
		expect(x1.okOrElse(() => 0).inner).toEqual(Ok("foo"));

		const x2: OptionEquipped<string> = equip(None as Option<string>);
		expect(x2.okOrElse(() => 0).inner).toEqual(Err(0));
	});

	test('or method', () => {
		const x1 = equip(2);
		const y1 = None;
		expect(x1.or(y1).inner).toEqual(2);

		const x2 = equip(None as Option<number>);
		const y2 = 100;
		expect(x2.or(y2).inner).toEqual(100);

		const x3 = equip(2);
		const y3 = 100;
		expect(x3.or(y3).inner).toEqual(2);

		const x4: OptionEquipped<number> = equip(None as Option<number>);
		const y4 = None;
		expect(x4.or(y4).inner).toEqual(None);
	});

	test('orElse method', () => {
		const x1 = equip(2);
		const y1 = None;
		expect(x1.orElse(() => y1).inner).toEqual(2);

		const x2 = equip(None as Option<number>);
		const y2 = 100;
		expect(x2.orElse(() => y2).inner).toEqual(100);

		const x3 = equip(2);
		const y3 = 100;
		expect(x3.orElse(() => y3).inner).toEqual(2);

		const x4: OptionEquipped<number> = equip(None as Option<number>);
		const y4 = None;
		expect(x4.orElse(() => y4).inner).toEqual(None);
	});

	test('replace method', () => {
		const x1 = equip(2);
		const old1 = x1.replace(5);
		expect(x1.inner).toEqual(5);
		expect(old1.inner).toEqual(2);

		const x2 = equip(None as Option<number>);
		const old2 = x2.replace(3);
		expect(x2.inner).toEqual(3);
		expect(old2.inner).toEqual(None);
	});

	test('take method', () => {
		const x1: OptionEquipped<number> = equip(2);
		const y1 = x1.take();
		expect(x1.inner).toEqual(None);
		expect(y1.inner).toEqual(2);

		const x2: OptionEquipped<number> = equip(None as Option<number>);
		const y2 = x2.take();
		expect(x2.inner).toEqual(None);
		expect(y2.inner).toEqual(None);
	});

	test('transpose method', () => {
		type SomeErr = 1234;

		// Some OptionEquipped of Ok ResultEquipped
		const x1: OptionEquipped<ResultEquipped<number, SomeErr>>
			= new OptionEquipped(equip(Ok(5)));
		const y1: ResultEquipped<Option<number>, SomeErr>
			= equip(Ok(5));
		expect(x1.transpose()).toEqual(y1);

		// Some OptionEquipped of Err ResultEquipped
		const x2: OptionEquipped<ResultEquipped<number, SomeErr>>
			= new OptionEquipped(equip(Err(1234)));
		const y2: ResultEquipped<Option<number>, SomeErr>
			= equip(Err(1234));
		expect(x2.transpose()).toEqual(y2);

		// Some OptionEquipped of Ok Result
		const x3: OptionEquipped<Result<number, SomeErr>>
			= new OptionEquipped(Ok(5));
		const y3: ResultEquipped<Option<number>, SomeErr>
			= equip(Ok(5));
		expect(x3.transpose()).toEqual(y3);

		// Some OptionEquipped of Err Result
		const x4: OptionEquipped<Result<number, SomeErr>>
			= new OptionEquipped(Err(1234));
		const y4: ResultEquipped<Option<number>, SomeErr>
			= equip(Err(1234));
		expect(x4.transpose()).toEqual(y4);

		// None OptionEquipped
		const x5: OptionEquipped<Result<number, SomeErr>>
			= equip(None as Option<Result<number, SomeErr>>);
		const y5: ResultEquipped<Option<number>, SomeErr>
			= equip(Ok(None));
		expect(x5.transpose()).toEqual(y5);

		const json1: Option<RawJson<number>> = '}' as Option<RawJson<number>>;
		const parsed1 = equip(json1)
			.map(parseJson)
			.transpose();
		expect(parsed1.__kind).toEqual(ResultKind.Err);

		const json2: Option<RawJson<number>> = '5' as Option<RawJson<number>>;
		const parsed2 = equip(json2)
			.map(parseJson)
			.transpose();
		expect(parsed2.__kind).toEqual(ResultKind.Ok);
	});

	test('unwrap method', () => {
		const x1: OptionEquipped<string> = equip("air");
		expect(x1.unwrap()).toEqual("air");

		const x2: OptionEquipped<string> = equip(None as Option<string>);
		expect(() => x2.unwrap()).toThrowError();
	});

	test('unwrapOr method', () => {
		expect(equip("car").unwrapOr("bike")).toEqual("car");
		expect(equip(None as Option<string>).unwrapOr("bike")).toEqual("bike");
	});

	test('unwrapOrElse method', () => {
		expect(equip("car").unwrapOrElse(() => "bike")).toEqual("car");
		expect(
			equip(None as Option<string>).unwrapOrElse(() => "bike"),
		).toEqual("bike");
	});

	test('xor method', () => {
		const x1: OptionEquipped<number> = equip(2);
		const y1: Option<number> = None;
		expect(x1.xor(y1).inner).toEqual(2);

		const x2: OptionEquipped<number> = equip(None as Option<number>);
		const y2 = 2;
		expect(x2.xor(y2).inner).toEqual(2);

		const x3: OptionEquipped<number> = equip(2);
		const y3 = 2;
		expect(x3.xor(y3).inner).toEqual(None);

		const x4: OptionEquipped<number> = equip(None as Option<number>);
		const y4: Option<number> = None;
		expect(x4.xor(y4).inner).toEqual(None);
	});

	test('zip method', () => {
		const x: OptionEquipped<number> = equip(1);
		const y: Option<string> = "hi";
		const z: Option<number> = None;

		expect(x.zip(y).inner).toEqual([1, "hi"]);
		expect(x.zip(z).inner).toEqual(None);
	});

	test('zipWith method', () => {
		interface Point {
			x: number;
			y: number;
		}

		function newPoint(x: number, y: number): Point {
			return {
				x,
				y,
			};
		};

		const x: OptionEquipped<number> = equip(17.5);
		const y: Option<number> = 42.7;

		const targetPoint: Point = newPoint(17.5, 42.7);

		expect(x.zipWith(y, newPoint).inner).toEqual(targetPoint);
		expect(x.zipWith(None, newPoint).inner).toEqual(None);
	});
});
