# rustic

`rustic` is a TypeScript library providing emulation of `Rust`'s `Option` and `Result` types (and some useful wrappers for common js functions as well!).

The repo has 100% test code coverage, so you can be sure it will never fail! Even more in your production code™. (The not fail part is obviously a lie. Test your code.)

---
* [Installation](#installation)
* [Usage](#usage)
	* [Result](#result)
	* [Option](#option)
* [Wrappers](#wrappers)
	* [catchResult](#catchResult)
	* [parseJson](#parsejson)
---

# Installation

Just install as any other package:
```sh
$ npm i rustic
```

# Usage

## Result

1. Let's suppose we you have a fallible function that'll return an error for random number lower than 5:

```ts
import { Result, Err, Ok, isOk } from 'rustic';

function fallible(): Result<number, string> {
	const zeroToTen: number = Math.random() * 10;

	// Using Err and Ok helper as a shorthand to produce Result
	if (zeroToTen < 5) {
		return Err("Lower than 5");
	} else {
		return Ok(zeroToTen);
	}
}

const res = fallible();

// Using isOk helper will do this for You, but You can also
// access the `__kind` field and compare it with `ResultKind` enum directly
if (isOk(res)) {
	// Typescript infers res.data's type as `number`
	console.log('Successful num sq:', res.data * res.data);	// Successful num sq: <number>
} else {
	console.log('Error:', res.data);	// 'Error: Lower than 5'
}
```

2. Suppose you want to map the Result of a fallible function:

```ts
import { Result, equip, ResultEquipped } from 'rustic';

function fallible(): Result<number, string> { ... }

const res: Result<number, string> = fallible();

// Call `equip` with the Result of fallible function
const equipped: ResultEquipped<number, string> = equip(res);

// Use as You would Rust's Result
const squared: number = equipped.map(n => n * n).expect('Squared n');

// Using unwrap can cause a panic: `panicked at 'Squared n: "<err message>"'`

// You can access the underlying Result<number, string> using the `.inner` getter:
// `equipped.inner`;

console.log('Squared', squared);
```

## Option

1. Option follows the same methods as Result does:

```ts
import { Option } from 'rustic';

function returnsOption(): Option<number> { ... }

const res: Option<number> = returnsOption();

if (res == null) {
	console.log('Returned null');
} else {
	// Typescript can infer for sure, that the res is of type `number`.
	console.log('Returned num:', res * 2);
}
```

2. Call `equip` with the optional variable to gain access to the full functionality:

```ts
import { Option, equip, OptionEquipped } from 'rustic';

function returnsOption(): Option<number> { ... }

const res: OptionEquipped<number> = equip(returnsOption());

const squared = res.map(n => n * n);

// Unwrap can lead to panics. You can still access the underlying Option<number>
// by using `.inner`: `squared.inner`
console.log('Sqared num:', squared.unwrap());
```

# Wrappers

## catchResult
```ts
import { catchResult } from 'rustic';

function throwsError(): void { throw new Error('1234') }

function doesNotThrowError(): number { return 5 }

const res1 = catchResult(throwsError);	// Err('Error: 1234')
const res2 = catchResult(doesNotThrowError);	// Ok(5)
```

## parseJson
```ts
import { parseJson, Result } from 'rustic';

const parsed1: Result<number, string> = parseJson('5');	// Ok(5)

const parsed2: Result<number, string> = parseJson('{');	// Err('...')
```
