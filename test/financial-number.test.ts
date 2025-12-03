import { test } from 'node:test'
import assert from 'node:assert'
import number, { type FinancialNumberValue } from '../index.ts'

const fnv = (value: bigint, decimal_places: bigint): FinancialNumberValue => ({ value, decimal_places })

test(`adding and subtracting`, () => {
	assert.strictEqual(number(`100`).plus(`400.500`).toString(), `500.500`)
	assert.strictEqual(number(fnv(100n, 0n)).plus(fnv(400500n, 3n)).toString(), `500.500`)
	assert.strictEqual(number(`12.12`).plus(`12.2`).minus(`12.000`).toString(), `12.320`)
	assert.strictEqual(number(fnv(1212n, 2n)).plus(fnv(122n, 1n)).minus(fnv(12000n, 3n)).toString(), `12.320`)
	assert.strictEqual(number(`-10`).plus(`10`).toString(), `0`)
	assert.strictEqual(number(fnv(-10n, 0n)).plus(fnv(10n, 0n)).toString(), `0`)
})

test(`multiplication and whatever`, () => {
	assert.strictEqual(number(`12`).times(`12.45`).toString(), `149.40`)
	assert.strictEqual(number(fnv(12n, 0n)).times(fnv(1245n, 2n)).toString(), `149.40`)
	assert.strictEqual(number(`1.57`).times(`1.13`).plus(`1`).toString(), `2.7741`)
	assert.strictEqual(number(fnv(157n, 2n)).times(fnv(113n, 2n)).plus(fnv(1n, 0n)).toString(), `2.7741`)
	assert.strictEqual(number(`1.000`).times(`1.5`).toString(), `1.5000`)
	assert.strictEqual(number(fnv(1000n, 3n)).times(fnv(15n, 1n)).toString(), `1.5000`)
})

test(`totally immutable baby`, () => {
	const three = number(`3`)
	const threeFnv = number(fnv(3n, 0n))

	assert.strictEqual(three.times(`4`).toString(), `12`)
	assert.strictEqual(threeFnv.times(fnv(4n, 0n)).toString(), `12`)
	assert.strictEqual(three.times(`3.00`).toString(), `9.00`)
	assert.strictEqual(threeFnv.times(fnv(300n, 2n)).toString(), `9.00`)
})

test(`works with number objects too`, () => {
	const three = number(`3`)
	const four = number(`4`)

	assert.strictEqual(three.times(four).toString(), `12`)

	const threeFnv = number(fnv(3n, 0n))
	const fourFnv = number(fnv(4n, 0n))

	assert.strictEqual(threeFnv.times(fourFnv).toString(), `12`)
})

test(`getDecimalPlaces`, () => {
	assert.strictEqual(number(`4`).getDecimalPlaces(), 0n)
	assert.strictEqual(number(fnv(4n, 0n)).getDecimalPlaces(), 0n)
	assert.strictEqual(number(`5.77`).getDecimalPlaces(), 2n)
	assert.strictEqual(number(fnv(577n, 2n)).getDecimalPlaces(), 2n)
})

test(`equality`, () => {
	assert.ok(number(`13`).equal(`13.000`))
	assert.ok(number(fnv(13n, 0n)).equal(fnv(13000n, 3n)))
	assert.ok(!number(`13`).equal(`13.0000000001`))
	assert.ok(!number(fnv(13n, 0n)).equal(fnv(130000000001n, 10n)))
	assert.ok(number(`13.000`).equal(`13`))
	assert.ok(number(fnv(13000n, 3n)).equal(fnv(13n, 0n)))
	assert.ok(!number(`13.0000000001`).equal(`13`))
	assert.ok(!number(fnv(130000000001n, 10n)).equal(fnv(13n, 0n)))
	assert.ok(number(`13`).equal(`13`))
	assert.ok(number(fnv(13n, 0n)).equal(fnv(13n, 0n)))
	assert.ok(number(`000013`).equal(`13.000`))
	assert.ok(number(fnv(13n, 0n)).equal(fnv(13000n, 3n)))
})

test(`less than and greater than`, () => {
	assert.ok(number(`13`).lt(`13.000001`))
	assert.ok(number(fnv(13n, 0n)).lt(fnv(13000001n, 6n)))
	assert.ok(!number(`13`).lt(`13.000000`))
	assert.ok(!number(fnv(13n, 0n)).lt(fnv(13000000n, 6n)))

	assert.ok(number(`13`).lte(`13.000000`))
	assert.ok(number(fnv(13n, 0n)).lte(fnv(13000000n, 6n)))
	assert.ok(!number(`13.0000001`).lte(`13.000000`))
	assert.ok(!number(fnv(130000001n, 7n)).lte(fnv(13000000n, 6n)))

	assert.ok(number(`13`).gt(`12`))
	assert.ok(number(fnv(13n, 0n)).gt(fnv(12n, 0n)))
	assert.ok(!number(`13`).gt(`15`))
	assert.ok(!number(fnv(13n, 0n)).gt(fnv(15n, 0n)))
	assert.ok(number(`10`).gte(`8`))
	assert.ok(number(fnv(10n, 0n)).gte(fnv(8n, 0n)))
	assert.ok(!number(`10`).gte(`10.000050505`))
	assert.ok(!number(fnv(10n, 0n)).gte(fnv(10000050505n, 9n)))
})

test(`changing decimal places with default trimming strategy`, () => {
	assert.strictEqual(number(`12.444`).toString(0), `12`, `decimal places decreasing to 0`)
	assert.strictEqual(number(fnv(12444n, 3n)).toString(0), `12`, `fnv: decimal places decreasing to 0`)
	assert.strictEqual(number(`0`).changeDecimalPlaces(5).toString(), `0.00000`, `decimal places increasing from 0`)
	assert.strictEqual(number(fnv(0n, 0n)).changeDecimalPlaces(5).toString(), `0.00000`, `fnv: decimal places increasing from 0`)
	assert.strictEqual(number(`1.11`).toString(2), `1.11`, `same as existing decimal places`)
	assert.strictEqual(number(fnv(111n, 2n)).toString(2), `1.11`, `fnv: same as existing decimal places`)
	assert.strictEqual(number(`12.888888`).toString(3), `12.888`, `decimal places decreasing`)
	assert.strictEqual(number(fnv(12888888n, 6n)).toString(3), `12.888`, `fnv: decimal places decreasing`)
	assert.strictEqual(number(`5.44`).changeDecimalPlaces(4).toString(), `5.4400`, `decimal places increasing`)
	assert.strictEqual(number(fnv(544n, 2n)).changeDecimalPlaces(4).toString(), `5.4400`, `fnv: decimal places increasing`)

	assert.strictEqual(number(`-12.444`).toString(0), `-12`, `negative number: decimal places decreasing to 0`)
	assert.strictEqual(number(fnv(-12444n, 3n)).toString(0), `-12`, `fnv negative number: decimal places decreasing to 0`)
	assert.strictEqual(number(`-0`).changeDecimalPlaces(5).toString(), `0.00000`, `negative number: decimal places increasing from 0`)
	assert.strictEqual(number(fnv(0n, 0n)).changeDecimalPlaces(5).toString(), `0.00000`, `fnv negative number: decimal places increasing from 0`)
	assert.strictEqual(number(`-1.11`).toString(2), `-1.11`, `negative number: same as existing decimal places`)
	assert.strictEqual(number(fnv(-111n, 2n)).toString(2), `-1.11`, `fnv negative number: same as existing decimal places`)
	assert.strictEqual(number(`-12.888888`).toString(3), `-12.888`, `negative number: decimal places decreasing`)
	assert.strictEqual(number(fnv(-12888888n, 6n)).toString(3), `-12.888`, `fnv negative number: decimal places decreasing`)
	assert.strictEqual(number(`-5.44`).changeDecimalPlaces(4).toString(), `-5.4400`, `negative number: decimal places increasing`)
	assert.strictEqual(number(fnv(-544n, 2n)).changeDecimalPlaces(4).toString(), `-5.4400`, `fnv negative number: decimal places increasing`)
})

test(`changing decimal places by rounding`, () => {
	assert.strictEqual(number(`12.544`).toString(0, number.round), `13`, `decimal places decreasing to 0`)
	assert.strictEqual(number(fnv(12544n, 3n)).toString(0, number.round), `13`, `fnv: decimal places decreasing to 0`)
	assert.strictEqual(number(`0`).changeDecimalPlaces(5, number.round).toString(), `0.00000`, `decimal places increasing from 0`)
	assert.strictEqual(number(fnv(0n, 0n)).changeDecimalPlaces(5, number.round).toString(), `0.00000`, `fnv: decimal places increasing from 0`)
	assert.strictEqual(number(`1.55`).toString(2, number.round), `1.55`, `same as existing decimal places`)
	assert.strictEqual(number(fnv(155n, 2n)).toString(2, number.round), `1.55`, `fnv: same as existing decimal places`)
	assert.strictEqual(number(`12.888888`).toString(3, number.round), `12.889`, `decimal places decreasing`)
	assert.strictEqual(number(fnv(12888888n, 6n)).toString(3, number.round), `12.889`, `fnv: decimal places decreasing`)
	assert.strictEqual(number(`5.64`).changeDecimalPlaces(4, number.round).toString(), `5.6400`, `decimal places increasing`)
	assert.strictEqual(number(fnv(564n, 2n)).changeDecimalPlaces(4, number.round).toString(), `5.6400`, `fnv: decimal places increasing`)

	assert.strictEqual(number(`-12.544`).toString(0, number.round), `-13`, `negative number: decimal places decreasing to 0`)
	assert.strictEqual(number(fnv(-12544n, 3n)).toString(0, number.round), `-13`, `fnv negative number: decimal places decreasing to 0`)
	assert.strictEqual(number(`-0`).changeDecimalPlaces(5, number.round).toString(), `0.00000`, `negative number: decimal places increasing from 0`)
	assert.strictEqual(number(fnv(0n, 0n)).changeDecimalPlaces(5, number.round).toString(), `0.00000`, `fnv negative number: decimal places increasing from 0`)
	assert.strictEqual(number(`-1.55`).toString(2, number.round), `-1.55`, `negative number: same as existing decimal places`)
	assert.strictEqual(number(fnv(-155n, 2n)).toString(2, number.round), `-1.55`, `fnv negative number: same as existing decimal places`)
	assert.strictEqual(number(`-12.888888`).toString(3, number.round), `-12.889`, `negative number: decimal places decreasing`)
	assert.strictEqual(number(fnv(-12888888n, 6n)).toString(3, number.round), `-12.889`, `fnv negative number: decimal places decreasing`)
	assert.strictEqual(number(`-5.64`).changeDecimalPlaces(4, number.round).toString(), `-5.6400`, `negative number: decimal places increasing`)
	assert.strictEqual(number(fnv(-564n, 2n)).changeDecimalPlaces(4, number.round).toString(), `-5.6400`, `fnv negative number: decimal places increasing`)
})

test(`toJSON`, () => {
	assert.strictEqual(number(`-5.64`).toJSON(), `-5.64`)
	assert.strictEqual(number(fnv(-564n, 2n)).toJSON(), `-5.64`)
	assert.strictEqual(number(`12.544`).toJSON(), `12.544`)
	assert.strictEqual(number(fnv(12544n, 3n)).toJSON(), `12.544`)
})

test(`Validate inputs when the initial function is called`, () => {
	assert.throws(() => number(`.123`), /Invalid input/)
	assert.throws(() => number(`wat`), /Invalid input/)
})

test(`modulo`, () => {
	assert.strictEqual(number(`12.00`).mod(`0.01`).toString(), `0.00`)
	assert.strictEqual(number(fnv(1200n, 2n)).mod(fnv(1n, 2n)).toString(), `0.00`)
	assert.strictEqual(number(`12.005`).mod(`0.01`).toString(), `0.005`)
	assert.strictEqual(number(fnv(12005n, 3n)).mod(fnv(1n, 2n)).toString(), `0.005`)
})

test(`pow - basic exponentiation`, () => {
	assert.strictEqual(number(`2`).pow(3n).toString(), `8`)
	assert.strictEqual(number(fnv(2n, 0n)).pow(3n).toString(), `8`)
	assert.strictEqual(number(`10`).pow(4n).toString(), `10000`)
	assert.strictEqual(number(fnv(10n, 0n)).pow(4n).toString(), `10000`)
})

test(`pow - exponent of 0 returns 1`, () => {
	assert.strictEqual(number(`5`).pow(0n).toString(), `1`)
	assert.strictEqual(number(`123.456`).pow(0n).toString(), `1`)
	assert.strictEqual(number(`-99`).pow(0n).toString(), `1`)
})

test(`pow - exponent of 1 returns same value`, () => {
	assert.strictEqual(number(`5`).pow(1n).toString(), `5`)
	assert.strictEqual(number(`123.456`).pow(1n).toString(), `123.456`)
	assert.strictEqual(number(`-99`).pow(1n).toString(), `-99`)
})

test(`pow - decimal base`, () => {
	// 1.5^2 = 2.25
	assert.strictEqual(number(`1.5`).pow(2n).toString(), `2.25`)
	assert.strictEqual(number(fnv(15n, 1n)).pow(2n).toString(), `2.25`)
	// 0.5^3 = 0.125
	assert.strictEqual(number(`0.5`).pow(3n).toString(), `0.125`)
	// 1.1^2 = 1.21
	assert.strictEqual(number(`1.1`).pow(2n).toString(), `1.21`)
})

test(`pow - negative base`, () => {
	// (-2)^2 = 4
	assert.strictEqual(number(`-2`).pow(2n).toString(), `4`)
	// (-2)^3 = -8
	assert.strictEqual(number(`-2`).pow(3n).toString(), `-8`)
	// (-1.5)^2 = 2.25
	assert.strictEqual(number(`-1.5`).pow(2n).toString(), `2.25`)
	// (-1.5)^3 = -3.375
	assert.strictEqual(number(`-1.5`).pow(3n).toString(), `-3.375`)
})

test(`pow - decimal places accumulate`, () => {
	// 1.00^2 should have 4 decimal places (2*2)
	assert.strictEqual(number(`1.00`).pow(2n).toString(), `1.0000`)
	assert.strictEqual(number(`1.00`).pow(2n).getDecimalPlaces(), 4n)
	// 1.5^3 should have 3 decimal places (1*3)
	assert.strictEqual(number(`1.5`).pow(3n).toString(), `3.375`)
	assert.strictEqual(number(`1.5`).pow(3n).getDecimalPlaces(), 3n)
})
