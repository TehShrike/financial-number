import type { FinancialNumberValue } from './financial-number.ts'

const validNumberStringRegex = /^(-|\+)?(\d+)(\.(\d+))?$/

export function stringToFinancialNumberValue(str: string): FinancialNumberValue {
	if (!validNumberStringRegex.test(str)) {
		throw new Error(`Invalid input "${ str }"`)
	}
	const isNegative = str.startsWith('-')
	const absStr = (str.startsWith('-') || str.startsWith('+'))
		? str.substring(1)
		: str

	const parts = absStr.split('.')
	const integerPart = parts[0] || '0'
	const decimalPart = parts[1] || ''
	const decimal_places = BigInt(decimalPart.length)
	const absoluteValue = BigInt(integerPart + decimalPart)
	const value = isNegative ? -absoluteValue : absoluteValue
	return { value, decimal_places }
}

export function financialNumberValueToString(fnv: FinancialNumberValue): string {
	const isNegative = fnv.value < 0n
	const absValue = isNegative ? -fnv.value : fnv.value
	let str = absValue.toString()

	if (fnv.decimal_places === 0n) {
		return (isNegative && absValue !== 0n ? '-' : '') + str
	}

	const decimalPlaces = Number(fnv.decimal_places)
	while (str.length <= decimalPlaces) {
		str = '0' + str
	}

	const insertPosition = str.length - decimalPlaces
	const result = str.slice(0, insertPosition) + '.' + str.slice(insertPosition)
	return (isNegative && absValue !== 0n ? '-' : '') + result
}
