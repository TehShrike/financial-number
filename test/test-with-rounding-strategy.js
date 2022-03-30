const test = require(`tape`)
const { round, withDefaultRoundingStrategy } = require(`..`)

test(`with-rounding-strategy`, t => {
	const number = withDefaultRoundingStrategy(round)

	const un_rounded_number = number(`5.00`).times(`0.077`)

	t.equal(un_rounded_number.toString(2), `0.39`)

	t.ok(un_rounded_number.changePrecision(2).equal(`0.39`))

	t.equal(un_rounded_number.plus(`1`).minus(`1`).times(`1`).mod(`1`).toString(2), `0.39`)

	t.end()
})
