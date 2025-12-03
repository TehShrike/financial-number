import * as math from 'financial-arithmetic-functions'
import { stringToFinancialNumberValue, financialNumberValueToString } from './financial-number-string.ts'

export type FinancialNumberValue = {
	value: bigint
	decimal_places: bigint
}

export type NumberInput = FinancialNumber | string | FinancialNumberValue

const toFnv = (input: NumberInput): FinancialNumberValue => {
	if (typeof input === 'string') {
		return stringToFinancialNumberValue(input)
	}

	if (math.validate(input)) {
		return input
	}

	return input.valueOf()
}

export type FinancialNumber = {
	plus: (number: NumberInput) => FinancialNumber,
	minus: (number: NumberInput) => FinancialNumber,
	times: (number: NumberInput) => FinancialNumber,
	mod: (number: NumberInput) => FinancialNumber,
	getDecimalPlaces: () => bigint,
	toJSON: () => string,
	toString: (decimalPlaces?: number | bigint, roundingStrategy?: RoundingStrategy) => string,
	valueOf: () => FinancialNumberValue,
	changeDecimalPlaces: (decimalPlaces: number | bigint, roundingStrategy?: RoundingStrategy) => FinancialNumber,
	isNegative: () => boolean,
	equal: (number: NumberInput) => boolean,
	gt: (number: NumberInput) => boolean,
	gte: (number: NumberInput) => boolean,
	lt: (number: NumberInput) => boolean,
	lte: (number: NumberInput) => boolean,
}

export type RoundingStrategy = (number: FinancialNumberValue, targetDecimalPlaces: bigint) => FinancialNumberValue

const make_financial_number = (defaultRoundingStrategy: RoundingStrategy) => {
	if (typeof defaultRoundingStrategy !== `function`) {
		throw new Error(`That doesn't look like a valid rounding strategy (it's not a function)`)
	}

	const makeNumberObject = (input: NumberInput): FinancialNumber => {
		const fnv = toFnv(input)
		const self: FinancialNumber = {
			plus: (number: NumberInput) => makeNumberObject(math.add(fnv, toFnv(number))),
			minus: (number: NumberInput) => makeNumberObject(math.subtract(fnv, toFnv(number))),
			times: (number: NumberInput) => makeNumberObject(math.multiply(fnv, toFnv(number))),
			mod: (number: NumberInput) => makeNumberObject(math.modulo(fnv, toFnv(number))),
			getDecimalPlaces: () => fnv.decimal_places,
			toJSON: () => self.toString(),
			valueOf: () => fnv,
			toString: (decimalPlaces, roundingStrategy) => {
				if (typeof decimalPlaces === `number` || typeof decimalPlaces === `bigint`) {
					return self.changeDecimalPlaces(decimalPlaces, roundingStrategy).toString()
				}
				return financialNumberValueToString(fnv)
			},
			isNegative: () => fnv.value < 0n,
			equal: (number: NumberInput) => {
				const normalized = math.normalizeToSameDecimalPlaces(fnv, toFnv(number))
				return normalized.a === normalized.b
			},
			gt: (number: NumberInput) => {
				const normalized = math.normalizeToSameDecimalPlaces(fnv, toFnv(number))
				return normalized.a > normalized.b
			},
			lt: (number: NumberInput) => {
				const normalized = math.normalizeToSameDecimalPlaces(fnv, toFnv(number))
				return normalized.a < normalized.b
			},
			lte: (number: NumberInput) => {
				const normalized = math.normalizeToSameDecimalPlaces(fnv, toFnv(number))
				return normalized.a <= normalized.b
			},
			gte: (number: NumberInput) => {
				const normalized = math.normalizeToSameDecimalPlaces(fnv, toFnv(number))
				return normalized.a >= normalized.b
			},
			changeDecimalPlaces: (decimalPlaces: number | bigint, roundingStrategy?: RoundingStrategy) => {
				roundingStrategy = roundingStrategy || defaultRoundingStrategy
				return makeNumberObject(roundingStrategy(fnv, BigInt(decimalPlaces)))
			},
		}

		return self
	}

	return makeNumberObject
}

export default make_financial_number
