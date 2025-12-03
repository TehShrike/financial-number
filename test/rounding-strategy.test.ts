import { test } from 'node:test'
import assert from 'node:assert'
import { round, trim, type FinancialNumberValue } from '../index.ts'

const fnv = (value: bigint, decimal_places: bigint): FinancialNumberValue => ({ value, decimal_places })

test(`round - exactly at .5 boundary rounds away from zero`, () => {
	// Positive: rounds up
	assert.deepStrictEqual(round(fnv(15n, 1n), 0n), fnv(2n, 0n)) // 1.5 -> 2
	assert.deepStrictEqual(round(fnv(25n, 1n), 0n), fnv(3n, 0n)) // 2.5 -> 3
	assert.deepStrictEqual(round(fnv(125n, 2n), 1n), fnv(13n, 1n)) // 1.25 -> 1.3
	assert.deepStrictEqual(round(fnv(1005n, 3n), 2n), fnv(101n, 2n)) // 1.005 -> 1.01
	// Negative: rounds away from zero (more negative)
	assert.deepStrictEqual(round(fnv(-15n, 1n), 0n), fnv(-2n, 0n)) // -1.5 -> -2
	assert.deepStrictEqual(round(fnv(-25n, 1n), 0n), fnv(-3n, 0n)) // -2.5 -> -3
	assert.deepStrictEqual(round(fnv(-125n, 2n), 1n), fnv(-13n, 1n)) // -1.25 -> -1.3
})

test(`round - just above .5 boundary rounds away from zero`, () => {
	assert.deepStrictEqual(round(fnv(151n, 2n), 0n), fnv(2n, 0n)) // 1.51 -> 2
	assert.deepStrictEqual(round(fnv(1501n, 3n), 0n), fnv(2n, 0n)) // 1.501 -> 2
	assert.deepStrictEqual(round(fnv(-151n, 2n), 0n), fnv(-2n, 0n)) // -1.51 -> -2
	assert.deepStrictEqual(round(fnv(-1501n, 3n), 0n), fnv(-2n, 0n)) // -1.501 -> -2
})

test(`round - just below .5 boundary rounds toward zero`, () => {
	assert.deepStrictEqual(round(fnv(149n, 2n), 0n), fnv(1n, 0n)) // 1.49 -> 1
	assert.deepStrictEqual(round(fnv(1499n, 3n), 0n), fnv(1n, 0n)) // 1.499 -> 1
	assert.deepStrictEqual(round(fnv(-149n, 2n), 0n), fnv(-1n, 0n)) // -1.49 -> -1
	assert.deepStrictEqual(round(fnv(-1499n, 3n), 0n), fnv(-1n, 0n)) // -1.499 -> -1
})

test(`round - rounding causes carry to next digit`, () => {
	assert.deepStrictEqual(round(fnv(995n, 2n), 1n), fnv(100n, 1n)) // 9.95 -> 10.0
	assert.deepStrictEqual(round(fnv(9995n, 3n), 2n), fnv(1000n, 2n)) // 9.995 -> 10.00
	assert.deepStrictEqual(round(fnv(9999n, 2n), 1n), fnv(1000n, 1n)) // 99.99 -> 100.0
	assert.deepStrictEqual(round(fnv(-995n, 2n), 1n), fnv(-100n, 1n)) // -9.95 -> -10.0
	assert.deepStrictEqual(round(fnv(-9999n, 2n), 1n), fnv(-1000n, 1n)) // -99.99 -> -100.0
})

test(`round - to zero decimal places`, () => {
	assert.deepStrictEqual(round(fnv(14n, 1n), 0n), fnv(1n, 0n)) // 1.4 -> 1
	assert.deepStrictEqual(round(fnv(16n, 1n), 0n), fnv(2n, 0n)) // 1.6 -> 2
	assert.deepStrictEqual(round(fnv(19n, 1n), 0n), fnv(2n, 0n)) // 1.9 -> 2
	assert.deepStrictEqual(round(fnv(10n, 1n), 0n), fnv(1n, 0n)) // 1.0 -> 1
	assert.deepStrictEqual(round(fnv(-14n, 1n), 0n), fnv(-1n, 0n)) // -1.4 -> -1
	assert.deepStrictEqual(round(fnv(-16n, 1n), 0n), fnv(-2n, 0n)) // -1.6 -> -2
})

test(`round - from many decimal places`, () => {
	assert.deepStrictEqual(round(fnv(1999999n, 6n), 2n), fnv(200n, 2n)) // 1.999999 -> 2.00
	assert.deepStrictEqual(round(fnv(1234567n, 6n), 2n), fnv(123n, 2n)) // 1.234567 -> 1.23
	assert.deepStrictEqual(round(fnv(1235567n, 6n), 2n), fnv(124n, 2n)) // 1.235567 -> 1.24
})

test(`round - increasing decimal places (no rounding, just adds zeros)`, () => {
	assert.deepStrictEqual(round(fnv(1n, 0n), 2n), fnv(100n, 2n)) // 1 -> 1.00
	assert.deepStrictEqual(round(fnv(15n, 1n), 3n), fnv(1500n, 3n)) // 1.5 -> 1.500
	assert.deepStrictEqual(round(fnv(-15n, 1n), 3n), fnv(-1500n, 3n)) // -1.5 -> -1.500
})

test(`round - same decimal places (no change)`, () => {
	assert.deepStrictEqual(round(fnv(123n, 2n), 2n), fnv(123n, 2n)) // 1.23 -> 1.23
	assert.deepStrictEqual(round(fnv(-123n, 2n), 2n), fnv(-123n, 2n)) // -1.23 -> -1.23
	assert.deepStrictEqual(round(fnv(0n, 2n), 2n), fnv(0n, 2n)) // 0.00 -> 0.00
})

test(`round - zero values`, () => {
	assert.deepStrictEqual(round(fnv(0n, 0n), 0n), fnv(0n, 0n)) // 0 -> 0
	assert.deepStrictEqual(round(fnv(0n, 3n), 0n), fnv(0n, 0n)) // 0.000 -> 0
	assert.deepStrictEqual(round(fnv(0n, 0n), 3n), fnv(0n, 3n)) // 0 -> 0.000
	assert.deepStrictEqual(round(fnv(0n, 5n), 2n), fnv(0n, 2n)) // 0.00000 -> 0.00
})

test(`round - large numbers`, () => {
	assert.deepStrictEqual(
		round(fnv(123456789012345678905n, 1n), 0n),
		fnv(12345678901234567891n, 0n)
	) // rounds up
	assert.deepStrictEqual(
		round(fnv(123456789012345678904n, 1n), 0n),
		fnv(12345678901234567890n, 0n)
	) // rounds down
})

test(`trim - basic trimming`, () => {
	assert.deepStrictEqual(trim(fnv(1999n, 3n), 2n), fnv(199n, 2n)) // 1.999 -> 1.99 (not 2.00)
	assert.deepStrictEqual(trim(fnv(1234n, 3n), 2n), fnv(123n, 2n)) // 1.234 -> 1.23
	assert.deepStrictEqual(trim(fnv(-1999n, 3n), 2n), fnv(-199n, 2n)) // -1.999 -> -1.99
})

test(`trim - to zero decimal places`, () => {
	assert.deepStrictEqual(trim(fnv(19n, 1n), 0n), fnv(1n, 0n)) // 1.9 -> 1
	assert.deepStrictEqual(trim(fnv(99n, 1n), 0n), fnv(9n, 0n)) // 9.9 -> 9
	assert.deepStrictEqual(trim(fnv(-19n, 1n), 0n), fnv(-1n, 0n)) // -1.9 -> -1
})

test(`trim - increasing decimal places`, () => {
	assert.deepStrictEqual(trim(fnv(1n, 0n), 2n), fnv(100n, 2n)) // 1 -> 1.00
	assert.deepStrictEqual(trim(fnv(15n, 1n), 3n), fnv(1500n, 3n)) // 1.5 -> 1.500
})
