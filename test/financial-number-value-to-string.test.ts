import { test } from 'node:test'
import assert from 'node:assert'
import type { FinancialNumberValue } from '../index.ts'
import { financialNumberValueToString } from '../financial-number-string.ts'

const fnv = (value: bigint, decimal_places: bigint): FinancialNumberValue => ({ value, decimal_places })

test(`financialNumberValueToString - integers (no decimal places)`, () => {
	assert.strictEqual(financialNumberValueToString(fnv(0n, 0n)), `0`)
	assert.strictEqual(financialNumberValueToString(fnv(1n, 0n)), `1`)
	assert.strictEqual(financialNumberValueToString(fnv(9n, 0n)), `9`)
	assert.strictEqual(financialNumberValueToString(fnv(10n, 0n)), `10`)
	assert.strictEqual(financialNumberValueToString(fnv(123n, 0n)), `123`)
	assert.strictEqual(financialNumberValueToString(fnv(999999999n, 0n)), `999999999`)
	assert.strictEqual(financialNumberValueToString(fnv(-1n, 0n)), `-1`)
	assert.strictEqual(financialNumberValueToString(fnv(-9n, 0n)), `-9`)
	assert.strictEqual(financialNumberValueToString(fnv(-10n, 0n)), `-10`)
	assert.strictEqual(financialNumberValueToString(fnv(-123n, 0n)), `-123`)
	assert.strictEqual(financialNumberValueToString(fnv(-999999999n, 0n)), `-999999999`)
})

test(`financialNumberValueToString - simple decimals`, () => {
	assert.strictEqual(financialNumberValueToString(fnv(15n, 1n)), `1.5`)
	assert.strictEqual(financialNumberValueToString(fnv(123n, 2n)), `1.23`)
	assert.strictEqual(financialNumberValueToString(fnv(1234n, 3n)), `1.234`)
	assert.strictEqual(financialNumberValueToString(fnv(12345n, 4n)), `1.2345`)
	assert.strictEqual(financialNumberValueToString(fnv(-15n, 1n)), `-1.5`)
	assert.strictEqual(financialNumberValueToString(fnv(-123n, 2n)), `-1.23`)
	assert.strictEqual(financialNumberValueToString(fnv(-1234n, 3n)), `-1.234`)
	assert.strictEqual(financialNumberValueToString(fnv(-12345n, 4n)), `-1.2345`)
})

test(`financialNumberValueToString - decimals requiring leading zeros after decimal point`, () => {
	// When value has fewer digits than decimal_places, need leading zeros
	assert.strictEqual(financialNumberValueToString(fnv(5n, 1n)), `0.5`)
	assert.strictEqual(financialNumberValueToString(fnv(5n, 2n)), `0.05`)
	assert.strictEqual(financialNumberValueToString(fnv(5n, 3n)), `0.005`)
	assert.strictEqual(financialNumberValueToString(fnv(5n, 4n)), `0.0005`)
	assert.strictEqual(financialNumberValueToString(fnv(5n, 5n)), `0.00005`)
	assert.strictEqual(financialNumberValueToString(fnv(1n, 1n)), `0.1`)
	assert.strictEqual(financialNumberValueToString(fnv(1n, 5n)), `0.00001`)
	assert.strictEqual(financialNumberValueToString(fnv(1n, 10n)), `0.0000000001`)
	assert.strictEqual(financialNumberValueToString(fnv(12n, 3n)), `0.012`)
	assert.strictEqual(financialNumberValueToString(fnv(12n, 4n)), `0.0012`)
	assert.strictEqual(financialNumberValueToString(fnv(123n, 5n)), `0.00123`)
	// Negative versions
	assert.strictEqual(financialNumberValueToString(fnv(-5n, 2n)), `-0.05`)
	assert.strictEqual(financialNumberValueToString(fnv(-5n, 3n)), `-0.005`)
	assert.strictEqual(financialNumberValueToString(fnv(-1n, 5n)), `-0.00001`)
	assert.strictEqual(financialNumberValueToString(fnv(-12n, 4n)), `-0.0012`)
})

test(`financialNumberValueToString - zero with decimal places (no negative sign)`, () => {
	assert.strictEqual(financialNumberValueToString(fnv(0n, 1n)), `0.0`)
	assert.strictEqual(financialNumberValueToString(fnv(0n, 2n)), `0.00`)
	assert.strictEqual(financialNumberValueToString(fnv(0n, 3n)), `0.000`)
	assert.strictEqual(financialNumberValueToString(fnv(0n, 5n)), `0.00000`)
	assert.strictEqual(financialNumberValueToString(fnv(0n, 10n)), `0.0000000000`)
})

test(`financialNumberValueToString - large numbers`, () => {
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 0n)), `123456789`)
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 2n)), `1234567.89`)
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 5n)), `1234.56789`)
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 8n)), `1.23456789`)
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 9n)), `0.123456789`)
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 10n)), `0.0123456789`)
	assert.strictEqual(financialNumberValueToString(fnv(123456789n, 15n)), `0.000000123456789`)
	assert.strictEqual(financialNumberValueToString(fnv(-123456789n, 5n)), `-1234.56789`)
	assert.strictEqual(financialNumberValueToString(fnv(-123456789n, 9n)), `-0.123456789`)
	assert.strictEqual(financialNumberValueToString(fnv(-123456789n, 15n)), `-0.000000123456789`)
	// Very large numbers
	assert.strictEqual(financialNumberValueToString(fnv(12345678901234567890n, 0n)), `12345678901234567890`)
	assert.strictEqual(financialNumberValueToString(fnv(12345678901234567890n, 10n)), `1234567890.1234567890`)
	assert.strictEqual(financialNumberValueToString(fnv(12345678901234567890n, 20n)), `0.12345678901234567890`)
})

test(`financialNumberValueToString - trailing zeros preserved`, () => {
	assert.strictEqual(financialNumberValueToString(fnv(100n, 2n)), `1.00`)
	assert.strictEqual(financialNumberValueToString(fnv(1000n, 3n)), `1.000`)
	assert.strictEqual(financialNumberValueToString(fnv(10000n, 4n)), `1.0000`)
	assert.strictEqual(financialNumberValueToString(fnv(500n, 2n)), `5.00`)
	assert.strictEqual(financialNumberValueToString(fnv(5000n, 3n)), `5.000`)
	assert.strictEqual(financialNumberValueToString(fnv(12000n, 3n)), `12.000`)
	assert.strictEqual(financialNumberValueToString(fnv(120n, 2n)), `1.20`)
	assert.strictEqual(financialNumberValueToString(fnv(-100n, 2n)), `-1.00`)
	assert.strictEqual(financialNumberValueToString(fnv(-500n, 2n)), `-5.00`)
	assert.strictEqual(financialNumberValueToString(fnv(-12000n, 3n)), `-12.000`)
})

test(`financialNumberValueToString - edge cases at decimal_places boundaries`, () => {
	// Exactly enough digits for integer part to be 0
	assert.strictEqual(financialNumberValueToString(fnv(99n, 2n)), `0.99`)
	assert.strictEqual(financialNumberValueToString(fnv(999n, 3n)), `0.999`)
	assert.strictEqual(financialNumberValueToString(fnv(9999n, 4n)), `0.9999`)
	// Just one more digit than decimal_places
	assert.strictEqual(financialNumberValueToString(fnv(100n, 2n)), `1.00`)
	assert.strictEqual(financialNumberValueToString(fnv(1000n, 3n)), `1.000`)
	assert.strictEqual(financialNumberValueToString(fnv(10000n, 4n)), `1.0000`)
	// Single digit values at various decimal places
	assert.strictEqual(financialNumberValueToString(fnv(9n, 1n)), `0.9`)
	assert.strictEqual(financialNumberValueToString(fnv(9n, 2n)), `0.09`)
	assert.strictEqual(financialNumberValueToString(fnv(9n, 3n)), `0.009`)
})
