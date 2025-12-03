import * as math from 'financial-arithmetic-functions'
import withDefaultRoundingStrategy from './financial-number.ts'
import type { FinancialNumber, RoundingStrategy, FinancialNumberValue, NumberInput } from './financial-number.ts'

function adjustDecimalPlacesByTrimming(fnv: FinancialNumberValue, targetDecimalPlaces: bigint): FinancialNumberValue {
	const currentDecimalPlaces = fnv.decimal_places

	if (currentDecimalPlaces === targetDecimalPlaces) {
		return fnv
	} else if (targetDecimalPlaces < currentDecimalPlaces) {
		// Reducing decimal places: divide by 10^(currentDecimalPlaces - targetDecimalPlaces)
		const divisor = 10n ** (currentDecimalPlaces - targetDecimalPlaces)
		return {
			value: fnv.value / divisor,
			decimal_places: targetDecimalPlaces
		}
	} else {
		// Increasing decimal places: multiply by 10^(targetDecimalPlaces - currentDecimalPlaces)
		const multiplier = 10n ** (targetDecimalPlaces - currentDecimalPlaces)
		return {
			value: fnv.value * multiplier,
			decimal_places: targetDecimalPlaces
		}
	}
}

function adjustDecimalPlacesByRounding(fnv: FinancialNumberValue, targetDecimalPlaces: bigint): FinancialNumberValue {
	const currentDecimalPlaces = fnv.decimal_places
	const decimalPlacesAreDropping = targetDecimalPlaces < currentDecimalPlaces

	if (decimalPlacesAreDropping) {
		const isNegative = fnv.value < 0n
		// Create 0.5 at the target decimal places (e.g., targetDecimalPlaces=2 -> 0.005)
		const roundingValue: FinancialNumberValue = {
			value: 5n,
			decimal_places: targetDecimalPlaces + 1n
		}
		// Add for positive, subtract for negative (to round away from zero)
		fnv = isNegative ? math.subtract(fnv, roundingValue) : math.add(fnv, roundingValue)
	}

	return adjustDecimalPlacesByTrimming(fnv, targetDecimalPlaces)
}

type DefaultExportType = ReturnType<typeof withDefaultRoundingStrategy> & {
	trim: typeof adjustDecimalPlacesByTrimming,
	round: typeof adjustDecimalPlacesByRounding
}

const default_export: DefaultExportType = Object.assign(
	withDefaultRoundingStrategy(adjustDecimalPlacesByTrimming), {
		trim: adjustDecimalPlacesByTrimming,
		round: adjustDecimalPlacesByRounding,
	},
)

export default default_export

export {
	withDefaultRoundingStrategy,
	adjustDecimalPlacesByTrimming as trim,
	adjustDecimalPlacesByRounding as round,
}

export type {
	FinancialNumber,
	RoundingStrategy,
	FinancialNumberValue,
	NumberInput,
}
