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

const makeNumberObject = makeArgumentString(str => {
	const self = {
		plus: makeArgumentString(otherSide => makeNumberObject(math.add(str, otherSide))),
		minus: makeArgumentString(otherSide => makeNumberObject(math.subtract(str, otherSide))),
		times: makeArgumentString(otherSide => makeNumberObject(math.multiply(str, otherSide))),
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
			roundingStrategy = roundingStrategy || module.exports.trim

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
module.exports = makeNumberObject
module.exports.trim = adjustPrecisionByTrimming
module.exports.round = function adjustPrecisionByRounding(number, targetPrecision) {
	const currentPrecision = number.getPrecision()
	const precisionIsDropping = targetPrecision < currentPrecision

	if (precisionIsDropping) {
		const changeForRounding = makeNumberObject(`0.` + zeroes(targetPrecision) + `5`)
		const operation = number.isNegative() ? number.minus : number.plus
		number = operation(changeForRounding)
	}

	return adjustPrecisionByTrimming(number, targetPrecision)
}

function adjustPrecisionByTrimming(number, targetPrecision) {
	const currentPrecision = number.getPrecision()
	const str = number.toString()
	if (currentPrecision === targetPrecision) {
		return str
	} else if (targetPrecision === 0) {
		return str.split(`.`)[0]
	} else if (currentPrecision === 0) {
		return str + `.` + zeroes(targetPrecision)
	} else if (targetPrecision < currentPrecision) {
		const charactersToRemove = currentPrecision - targetPrecision
		return str.substring(0, str.length - charactersToRemove)
	} else if (currentPrecision < targetPrecision) {
		const zeroesToAdd = targetPrecision - currentPrecision
		return str + zeroes(zeroesToAdd)
	}
}

function zeroes(times) {
	let output = ``
	for (let i = 0; i < times; ++i) {
		output += `0`
	}
	return output
}

function trimNegationFromZero(str) {
	if (str.length >= 2 && str[0] === `-`) {
		const restOfNumberAfterDash = str.substring(1)
		return allZeroesRegex.test(restOfNumberAfterDash) ? restOfNumberAfterDash : str
	}
	return str
}
