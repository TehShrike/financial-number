import * as math from 'financial-arithmetic-functions'

const allZeroesRegex = /^0(\.0+)?$/
const someNonZeroDigit = /[1-9]/

const makeArgumentString = (fn: (str: string) => FinancialNumber) => (input: any) => {
	const input_as_string: string = typeof input === `string` ? input : input.toString()
	if (!math.validate(input_as_string)) {
		throw new Error(`Invalid input "${ input }"`)
	}
	return fn(input_as_string)
}

export type FinancialNumber = {
	plus: (number: FinancialNumber | string) => FinancialNumber,
	minus: (number: FinancialNumber | string) => FinancialNumber,
	times: (number: FinancialNumber | string) => FinancialNumber,
	mod: (number: FinancialNumber | string) => FinancialNumber,
	getPrecision: () => number,
	toJSON: () => string,
	toString: (precision?: number, roundingStrategy?: RoundingStrategy) => string,
	changePrecision: (precision: number, roundingStrategy?: RoundingStrategy) => FinancialNumber,
	isNegative: () => boolean,
	equal: (number: FinancialNumber | string) => boolean,
	gt: (number: FinancialNumber | string) => boolean,
	gte: (number: FinancialNumber | string) => boolean,
	lt: (number: FinancialNumber | string) => boolean,
	lte: (number: FinancialNumber | string) => boolean,
}

export type RoundingStrategy = (number: FinancialNumber, targetPrecision: number) => string

type MakeNumberObject = (str: string | FinancialNumber) => FinancialNumber
const make_financial_number = (defaultRoundingStrategy: RoundingStrategy): MakeNumberObject => {
	if (typeof defaultRoundingStrategy !== `function`) {
		throw new Error(`That doesn't look like a valid rounding strategy (it's not a function)`)
	}

	const makeNumberObject = makeArgumentString(str => {
		const self: FinancialNumber = {
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
			changePrecision(precision: number, roundingStrategy?: RoundingStrategy) {
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

function trimNegationFromZero(str: string) {
	if (str.length >= 2 && str[0] === `-`) {
		const restOfNumberAfterDash = str.substring(1)
		return allZeroesRegex.test(restOfNumberAfterDash) ? restOfNumberAfterDash : str
	}
	return str
}

export default make_financial_number
