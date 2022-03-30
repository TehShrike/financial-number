const math = require(`financial-arithmetic-functions`)

const allZeroesRegex = /^0(\.0+)?$/
const someNonZeroDigit = /[1-9]/

const makeArgumentString = fn => input => {
	const input_as_string = typeof input === `string` ? input : input.toString()
	if (!math.validate(input_as_string)) {
		throw new Error(`Invalid input "${ input }"`)
	}
	return fn(input_as_string)
}

module.exports = defaultRoundingStrategy => {
	if (typeof defaultRoundingStrategy !== `function`) {
		throw new Error(`That doesn't look like a valid rounding strategy (it's not a function)`)
	}

	const makeNumberObject = makeArgumentString(str => {
		const self = {
			plus: makeArgumentString(otherSide => makeNumberObject(math.add(str, otherSide))),
			minus: makeArgumentString(otherSide => makeNumberObject(math.subtract(str, otherSide))),
			times: makeArgumentString(otherSide => makeNumberObject(math.multiply(str, otherSide))),
			mod: makeArgumentString(otherSide => makeNumberObject(math.modulo(str, otherSide))),
			getPrecision() {
				return math.getPrecision(str)
			},
			toJSON() {
				return str
			},
			toString(precision, roundingStrategy) {
				if (typeof precision === `number`) {
					return self.changePrecision(precision, roundingStrategy).toString()
				}
				return str
			},
			changePrecision(precision, roundingStrategy) {
				roundingStrategy = roundingStrategy || defaultRoundingStrategy

				return makeNumberObject(trimNegationFromZero(roundingStrategy(makeNumberObject(str), precision)))
			},
			isNegative() {
				return self.toString()[0] === `-`
			},
			equal(otherSide) {
				const difference = makeNumberObject(otherSide).minus(self).toString()
				return allZeroesRegex.test(difference)
			},
			gt(otherSide) {
				const difference = self.minus(otherSide)
				return !difference.isNegative() && someNonZeroDigit.test(difference.toString()) && !self.equal(otherSide)
			},
			gte(otherSide) {
				return self.gt(otherSide) || self.equal(otherSide)
			},
			lt(otherSide) {
				return !self.gte(otherSide)
			},
			lte(otherSide) {
				return !self.gt(otherSide)
			},
		}

		return self
	})

	return makeNumberObject
}

function trimNegationFromZero(str) {
	if (str.length >= 2 && str[0] === `-`) {
		const restOfNumberAfterDash = str.substring(1)
		return allZeroesRegex.test(restOfNumberAfterDash) ? restOfNumberAfterDash : str
	}
	return str
}
