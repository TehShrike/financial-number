import { test } from 'node:test'
import assert from 'node:assert'
import number, { round, withDefaultRoundingStrategy } from '../index.ts'

test(`adding and subtracting`, () => {
	assert.strictEqual(number(`100`).plus(`400.500`).toString(), `500.500`)
	assert.strictEqual(number(`12.12`).plus(`12.2`).minus(`12.000`).toString(), `12.320`)
	assert.strictEqual(number(`-10`).plus(`10`).toString(), `0`)
})

test(`multiplication and whatever`, () => {
	assert.strictEqual(number(`12`).times(`12.45`).toString(), `149.40`)
	assert.strictEqual(number(`1.57`).times(`1.13`).plus(`1`).toString(), `2.7741`)
	assert.strictEqual(number(`1.000`).times(`1.5`).toString(), `1.5000`)
})

test(`totally immutable baby`, () => {
	const three = number(`3`)

	assert.strictEqual(three.times(`4`).toString(), `12`)
	assert.strictEqual(three.times(`3.00`).toString(), `9.00`)
})

test(`works with number objects too`, () => {
	const three = number(`3`)
	const four = number(`4`)

	assert.strictEqual(three.times(four).toString(), `12`)
})

test(`getPrecision`, () => {
	assert.strictEqual(number(`4`).getPrecision(), 0)
	assert.strictEqual(number(`5.77`).getPrecision(), 2)
})

test(`equality`, () => {
	assert.ok(number(`13`).equal(`13.000`))
	assert.ok(!number(`13`).equal(`13.0000000001`))
	assert.ok(number(`13.000`).equal(`13`))
	assert.ok(!number(`13.0000000001`).equal(`13`))
	assert.ok(number(`13`).equal(`13`))
	assert.ok(number(`000013`).equal(`13.000`))
})

test(`less than and greater than`, () => {
	assert.ok(number(`13`).lt(`13.000001`))
	assert.ok(!number(`13`).lt(`13.000000`))

	assert.ok(number(`13`).lte(`13.000000`))
	assert.ok(!number(`13.0000001`).lte(`13.000000`))

	assert.ok(number(`13`).gt(`12`))
	assert.ok(!number(`13`).gt(`15`))
	assert.ok(number(`10`).gte(`8`))
	assert.ok(!number(`10`).gte(`10.000050505`))
})

test(`changing precision with default trimming strategy`, () => {
	assert.strictEqual(number(`12.444`).toString(0), `12`, `precision decreasing to 0`)
	assert.strictEqual(number(`0`).changePrecision(5).toString(), `0.00000`, `precision increasing from 0`)
	assert.strictEqual(number(`1.11`).toString(2), `1.11`, `same as existing precision`)
	assert.strictEqual(number(`12.888888`).toString(3), `12.888`, `precision decreasing`)
	assert.strictEqual(number(`5.44`).changePrecision(4).toString(), `5.4400`, `precision increasing`)

	assert.strictEqual(number(`-12.444`).toString(0), `-12`, `negative number: precision decreasing to 0`)
	assert.strictEqual(number(`-0`).changePrecision(5).toString(), `0.00000`, `negative number: precision increasing from 0`)
	assert.strictEqual(number(`-1.11`).toString(2), `-1.11`, `negative number: same as existing precision`)
	assert.strictEqual(number(`-12.888888`).toString(3), `-12.888`, `negative number: precision decreasing`)
	assert.strictEqual(number(`-5.44`).changePrecision(4).toString(), `-5.4400`, `negative number: precision increasing`)
})

test(`changing precision by rounding`, () => {
	assert.strictEqual(number(`12.544`).toString(0, number.round), `13`, `precision decreasing to 0`)
	assert.strictEqual(number(`0`).changePrecision(5, number.round).toString(), `0.00000`, `precision increasing from 0`)
	assert.strictEqual(number(`1.55`).toString(2, number.round), `1.55`, `same as existing precision`)
	assert.strictEqual(number(`12.888888`).toString(3, number.round), `12.889`, `precision decreasing`)
	assert.strictEqual(number(`5.64`).changePrecision(4, number.round).toString(), `5.6400`, `precision increasing`)

	assert.strictEqual(number(`-12.544`).toString(0, number.round), `-13`, `negative number: precision decreasing to 0`)
	assert.strictEqual(number(`-0`).changePrecision(5, number.round).toString(), `0.00000`, `negative number: precision increasing from 0`)
	assert.strictEqual(number(`-1.55`).toString(2, number.round), `-1.55`, `negative number: same as existing precision`)
	assert.strictEqual(number(`-12.888888`).toString(3, number.round), `-12.889`, `negative number: precision decreasing`)
	assert.strictEqual(number(`-5.64`).changePrecision(4, number.round).toString(), `-5.6400`, `negative number: precision increasing`)
})

test(`toJSON`, () => {
	assert.strictEqual(number(`-5.64`).toJSON(), `-5.64`)
	assert.strictEqual(number(`12.544`).toJSON(), `12.544`)
})

test(`Validate inputs when the initial function is called`, () => {
	assert.throws(() => number(`.123`), /Invalid input/)
	assert.throws(() => number(`wat`), /Invalid input/)
})

test(`modulo`, () => {
	assert.strictEqual(number(`12.00`).mod(`0.01`).toString(), `0.00`)
	assert.strictEqual(number(`12.005`).mod(`0.01`).toString(), `0.005`)
})

test(`with-rounding-strategy`, () => {
	const number = withDefaultRoundingStrategy(round)

	const un_rounded_number = number(`5.00`).times(`0.077`)

	assert.strictEqual(un_rounded_number.toString(2), `0.39`)

	assert.ok(un_rounded_number.changePrecision(2).equal(`0.39`))

	assert.strictEqual(un_rounded_number.plus(`1`).minus(`1`).times(`1`).mod(`1`).toString(2), `0.39`)
})
