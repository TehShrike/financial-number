const test = require(`tape`)
const number = require(`../`)

test(`adding and subtracting`, t => {
	t.equal(number(`100`).plus(`400.500`).toString(), `500.500`)
	t.equal(number(`12.12`).plus(`12.2`).minus(`12.000`).toString(), `12.320`)
	t.equal(number(`-10`).plus(`10`).toString(), `0`)

	t.end()
})

test(`multiplication and whatever`, t => {
	t.equal(number(`12`).times(`12.45`).toString(), `149.40`)
	t.equal(number(`1.57`).times(`1.13`).plus(`1`).toString(), `2.7741`)
	t.equal(number(`1.000`).times(`1.5`).toString(), `1.5000`)

	t.end()
})

test(`totally immutable baby`, t => {
	const three = number(`3`)

	t.equal(three.times(`4`).toString(), `12`)
	t.equal(three.times(`3.00`).toString(), `9.00`)

	t.end()
})

test(`works with number objects too`, t => {
	const three = number(`3`)
	const four = number(`4`)

	t.equal(three.times(four).toString(), `12`)
	t.end()
})

test(`getPrecision`, t => {
	t.equal(number(`4`).getPrecision(), 0)
	t.equal(number(`5.77`).getPrecision(), 2)

	t.end()
})

test(`equality`, t => {
	t.ok(number(`13`).equal(`13.000`))
	t.notOk(number(`13`).equal(`13.0000000001`))
	t.ok(number(`13.000`).equal(`13`))
	t.notOk(number(`13.0000000001`).equal(`13`))
	t.ok(number(`13`).equal(`13`))
	t.ok(number(`000013`).equal(`13.000`))

	t.end()
})

test(`less than and greater than`, t => {
	t.ok(number(`13`).lt(`13.000001`))
	t.notOk(number(`13`).lt(`13.000000`))

	t.ok(number(`13`).lte(`13.000000`))
	t.notOk(number(`13.0000001`).lte(`13.000000`))

	t.ok(number(`13`).gt(`12`))
	t.notOk(number(`13`).gt(`15`))
	t.ok(number(`10`).gte(`8`))
	t.notOk(number(`10`).gte(`10.000050505`))

	t.end()
})

test(`changing precision with default trimming strategy`, t => {
	t.equal(number(`12.444`).toString(0), `12`, `precision decreasing to 0`)
	t.equal(number(`0`).changePrecision(5).toString(), `0.00000`, `precision increasing from 0`)
	t.equal(number(`1.11`).toString(2), `1.11`, `same as existing precision`)
	t.equal(number(`12.888888`).toString(3), `12.888`, `precision decreasing`)
	t.equal(number(`5.44`).changePrecision(4).toString(), `5.4400`, `precision increasing`)

	t.equal(number(`-12.444`).toString(0), `-12`, `negative number: precision decreasing to 0`)
	t.equal(number(`-0`).changePrecision(5).toString(), `0.00000`, `negative number: precision increasing from 0`)
	t.equal(number(`-1.11`).toString(2), `-1.11`, `negative number: same as existing precision`)
	t.equal(number(`-12.888888`).toString(3), `-12.888`, `negative number: precision decreasing`)
	t.equal(number(`-5.44`).changePrecision(4).toString(), `-5.4400`, `negative number: precision increasing`)

	t.end()
})

test(`changing precision by rounding`, t => {
	t.equal(number(`12.544`).toString(0, number.round), `13`, `precision decreasing to 0`)
	t.equal(number(`0`).changePrecision(5, number.round).toString(), `0.00000`, `precision increasing from 0`)
	t.equal(number(`1.55`).toString(2, number.round), `1.55`, `same as existing precision`)
	t.equal(number(`12.888888`).toString(3, number.round), `12.889`, `precision decreasing`)
	t.equal(number(`5.64`).changePrecision(4, number.round).toString(), `5.6400`, `precision increasing`)

	t.equal(number(`-12.544`).toString(0, number.round), `-13`, `negative number: precision decreasing to 0`)
	t.equal(number(`-0`).changePrecision(5, number.round).toString(), `0.00000`, `negative number: precision increasing from 0`)
	t.equal(number(`-1.55`).toString(2, number.round), `-1.55`, `negative number: same as existing precision`)
	t.equal(number(`-12.888888`).toString(3, number.round), `-12.889`, `negative number: precision decreasing`)
	t.equal(number(`-5.64`).changePrecision(4, number.round).toString(), `-5.6400`, `negative number: precision increasing`)

	t.end()
})

test(`toJSON`, t => {
	t.equal(number(`-5.64`).toJSON(), `-5.64`)
	t.equal(number(`12.544`).toJSON(), `12.544`)

	t.end()
})

test(`Validate inputs when the initial function is called`, t => {
	t.throws(() => number(`.123`), /Invalid input/)
	t.throws(() => number(`wat`), /Invalid input/)

	t.end()
})
