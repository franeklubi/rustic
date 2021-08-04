import {
	todo,
	panic,
	equip,
	unimplemented,
} from './helpers';

import { Option } from './option/types';
import { Result } from './result/types';
import { OptionEquipped } from './option/equipped';
import { ResultEquipped } from './result/equipped';

import { Ok, Err, isOk, isErr } from './result/helpers';

import { None } from './option/consts';


describe('panic helpers', () => {
	test('panic helper', () => {
		expect(panic).toThrowError('panicked at \'explicit panic\'');

		expect(() => panic('test')).toThrowError('panicked at \'test\'');
	});

	test('todo helper', () => {
		expect(todo).toThrowError('panicked at \'not yet implemented\'');

		expect(() => todo('test'))
			.toThrowError('panicked at \'not yet implemented: test\'');
	});

	test('unimplemented helper', () => {
		expect(unimplemented).toThrowError('panicked at \'not implemented\'');

		expect(() => unimplemented('test'))
			.toThrowError('panicked at \'not implemented: test\'');
	});
});

describe('equip helper', () => {
	it('should equip Option correctly', () => {
		const x1: Option<number> = 4;
		expect(equip(x1)).toEqual(new OptionEquipped<number>(x1))

		const x2: Option<number> = None;
		expect(equip(x2)).toEqual(new OptionEquipped<number>(x2))
	});

	it('should equip Result correctly', () => {
		type SomeErr = 1234;

		const x1: Result<number, SomeErr> = Ok(4);
		expect(equip(x1)).toEqual(new ResultEquipped<number, SomeErr>(x1))

		const x2: Result<number, SomeErr> = Err(1234);
		expect(equip(x2)).toEqual(new ResultEquipped<number, SomeErr>(x2))
	});
});

describe('isOk and isErr helpers', () => {
	test('isOk', () => {
		const okRes: Result<number, string> = Ok(1234);
		const errRes: Result<number, string> = Err('1234');

		expect(isOk(okRes)).toEqual(true);
		expect(isOk(errRes)).toEqual(false);
	});

	test('isErr', () => {
		const okRes: Result<number, string> = Ok(1234);
		const errRes: Result<number, string> = Err('1234');

		expect(isErr(okRes)).toEqual(false);
		expect(isErr(errRes)).toEqual(true);
	});
});
