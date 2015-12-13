var math = require('financial-arithmetic-functions')

var allZeroesRegex = /^0(\.0+)?$/
var someNonZeroDigit = /[1-9]/

var makeNumberObject = makeArgumentString(function makeNumberObject(str) {
	var self = {
		plus: makeArgumentString(function plus(otherSide) {
			return makeNumberObject(math.add(str, otherSide))
		}),
		minus: makeArgumentString(function minus(otherSide) {
			return makeNumberObject(math.subtract(str, otherSide))
		}),
		times: makeArgumentString(function times(otherSide) {
			return makeNumberObject(math.multiply(str, otherSide))
		}),
		getPrecision: function getPrecision() {
			return math.getPrecision(str)
		},
		toString: function toString(precision, roundingStrategy) {
			if (typeof precision === 'number') {
				return self.changePrecision(precision, roundingStrategy).toString()
			}
			return str
		},
		changePrecision: function changePrecision(precision, roundingStrategy) {
			roundingStrategy = roundingStrategy || module.exports.trim

			return makeNumberObject(trimNegationFromZero(roundingStrategy(makeNumberObject(str), precision)))
		},
		isNegative: function() {
			return self.toString()[0] === '-'
		},
		equal: function equal(otherSide) {
			var difference = makeNumberObject(otherSide).minus(self).toString()
			return allZeroesRegex.test(difference)
		},
		gt: function greaterThan(otherSide) {
			var difference = self.minus(otherSide)
			return !difference.isNegative() && someNonZeroDigit.test(difference.toString()) && !self.equal(otherSide)
		},
		gte: function greaterThanOrEqualTo(otherSide) {
			return self.gt(otherSide) || self.equal(otherSide)
		},
		lt: function lessThan(otherSide) {
			return !self.gte(otherSide)
		},
		lte: function lessThanOrEqualTo(otherSide) {
			return !self.gt(otherSide)
		}
	}

	return self
})
module.exports = makeNumberObject
module.exports.trim = adjustPrecisionByTrimming
module.exports.round = function adjustPrecisionByRounding(number, targetPrecision) {
	var currentPrecision = number.getPrecision()
	var precisionIsDropping = targetPrecision < currentPrecision

	if (precisionIsDropping) {
		var changeForRounding = makeNumberObject('0.' + zeroes(targetPrecision) + '5')
		var operation = number.isNegative() ? number.minus : number.plus
		number = operation(changeForRounding)
	}

	return adjustPrecisionByTrimming(number, targetPrecision)
}

// Trimming!
function adjustPrecisionByTrimming(number, targetPrecision) {
	var currentPrecision = number.getPrecision()
	var str = number.toString()
	if (currentPrecision === targetPrecision) {
		return str
	} else if (targetPrecision === 0) {
		return str.split('.')[0]
	} else if (currentPrecision === 0) {
		return str + '.' + zeroes(targetPrecision)
	} else if (targetPrecision < currentPrecision) {
		var charactersToRemove = currentPrecision - targetPrecision
		return str.substring(0, str.length - charactersToRemove)
	} else if (currentPrecision < targetPrecision) {
		var zeroesToAdd = targetPrecision - currentPrecision
		return str + zeroes(zeroesToAdd)
	}
}

function zeroes(times) {
	var output = ''
	for (var i = 0; i < times; ++i) {
		output += '0'
	}
	return output
}

function makeArgumentString(fn) {
	return function(input) {
		return fn(toString(input))
	}
}

function toString(input) {
	return typeof input === 'string' ? input : input.toString()
}

function trimNegationFromZero(str) {
	if (str.length >= 2 && str[0] === '-') {
		var restOfNumberAfterDash = str.substring(1)
		return allZeroesRegex.test(restOfNumberAfterDash) ? restOfNumberAfterDash : str
	}
	return str
}
