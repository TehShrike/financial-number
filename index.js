var math = require('financial-arithmetic-functions')

module.exports = makeArgumentString(function makeNumberObject(str) {
	return {
		plus: makeArgumentString(function plus(otherSide) {
			return makeNumberObject(math.add(str, otherSide))
		}),
		minus: makeArgumentString(function minus(otherSide) {
			return makeNumberObject(math.subtract(str, otherSide))
		}),
		times: makeArgumentString(function times(otherSide) {
			return makeNumberObject(math.multiply(str, otherSide))
		}),
		toString: function toString() {
			return str
		}
	}
})

function makeArgumentString(fn) {
	return function(input) {
		return fn(toString(input))
	}
}

function toString(input) {
	return typeof input === 'string' ? input : input.toString()
}
