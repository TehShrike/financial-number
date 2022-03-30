const withDefaultRoundingStrategy = require(`./with-default-rounding-strategy.js`)

function adjustPrecisionByRounding(number, targetPrecision) {
	const currentPrecision = number.getPrecision()
	const precisionIsDropping = targetPrecision < currentPrecision

	if (precisionIsDropping) {
		const operation = number.isNegative() ? number.minus : number.plus
		number = operation(`0.` + zeroes(targetPrecision) + `5`)
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

module.exports = withDefaultRoundingStrategy(adjustPrecisionByTrimming)
module.exports.trim = adjustPrecisionByTrimming
module.exports.round = adjustPrecisionByRounding
module.exports.withDefaultRoundingStrategy = withDefaultRoundingStrategy
