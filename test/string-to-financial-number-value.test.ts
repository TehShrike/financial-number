import { test } from 'node:test'
import assert from 'node:assert'
import { stringToFinancialNumberValue } from '../financial-number-string.ts'

test(`stringToFinancialNumberValue - simple integers`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`0`), { value: 0n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`1`), { value: 1n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`9`), { value: 9n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`10`), { value: 10n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`123`), { value: 123n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`999999999`), { value: 999999999n, decimal_places: 0n })
})

test(`stringToFinancialNumberValue - negative integers`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`-0`), { value: 0n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-1`), { value: -1n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-9`), { value: -9n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-10`), { value: -10n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-123`), { value: -123n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-999999999`), { value: -999999999n, decimal_places: 0n })
})

test(`stringToFinancialNumberValue - explicit positive sign`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`+0`), { value: 0n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`+1`), { value: 1n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`+123`), { value: 123n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`+99.99`), { value: 9999n, decimal_places: 2n })
})

test(`stringToFinancialNumberValue - simple decimals`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`1.5`), { value: 15n, decimal_places: 1n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`1.23`), { value: 123n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`1.234`), { value: 1234n, decimal_places: 3n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`12.34`), { value: 1234n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`123.456`), { value: 123456n, decimal_places: 3n })
})

test(`stringToFinancialNumberValue - negative decimals`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`-1.5`), { value: -15n, decimal_places: 1n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-1.23`), { value: -123n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-12.34`), { value: -1234n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-0.5`), { value: -5n, decimal_places: 1n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-0.05`), { value: -5n, decimal_places: 2n })
})

test(`stringToFinancialNumberValue - leading zeros in integer part`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`007`), { value: 7n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0123`), { value: 123n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`007.50`), { value: 750n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-007`), { value: -7n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-0123.45`), { value: -12345n, decimal_places: 2n })
})

test(`stringToFinancialNumberValue - zero with decimal places`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.0`), { value: 0n, decimal_places: 1n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.00`), { value: 0n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.000`), { value: 0n, decimal_places: 3n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.00000`), { value: 0n, decimal_places: 5n })
})

test(`stringToFinancialNumberValue - trailing zeros preserved`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`1.00`), { value: 100n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`1.000`), { value: 1000n, decimal_places: 3n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`5.50`), { value: 550n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`12.300`), { value: 12300n, decimal_places: 3n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-1.00`), { value: -100n, decimal_places: 2n })
})

test(`stringToFinancialNumberValue - small decimals (leading zeros after decimal)`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.1`), { value: 1n, decimal_places: 1n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.01`), { value: 1n, decimal_places: 2n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.001`), { value: 1n, decimal_places: 3n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.0001`), { value: 1n, decimal_places: 4n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.00001`), { value: 1n, decimal_places: 5n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.012`), { value: 12n, decimal_places: 3n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.0012`), { value: 12n, decimal_places: 4n })
})

test(`stringToFinancialNumberValue - large numbers`, () => {
	assert.deepStrictEqual(stringToFinancialNumberValue(`12345678901234567890`), { value: 12345678901234567890n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`1234567890.1234567890`), { value: 12345678901234567890n, decimal_places: 10n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`-12345678901234567890`), { value: -12345678901234567890n, decimal_places: 0n })
	assert.deepStrictEqual(stringToFinancialNumberValue(`0.12345678901234567890`), { value: 12345678901234567890n, decimal_places: 20n })
})

test(`stringToFinancialNumberValue - invalid inputs throw`, () => {
	assert.throws(() => stringToFinancialNumberValue(``), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`.5`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`5.`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`.`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`abc`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`1.2.3`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`1,234`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`1 234`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(` 123`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`123 `), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`--1`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`++1`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`+-1`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`1e5`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`1E5`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`Infinity`), /Invalid input/)
	assert.throws(() => stringToFinancialNumberValue(`NaN`), /Invalid input/)
})
