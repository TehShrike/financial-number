var test = require('tape')
var number = require('../')

test('adding and subtracting', function(t) {
	t.equal(number('100').plus('400.500').toString(), '500.500')
	t.equal(number('12.12').plus('12.2').minus('12.000').toString(), '12.320')
	t.equal(number('-10').plus('10').toString(), '0')

	t.end()
})

test('multiplication and whatever', function(t) {
	t.equal(number('12').times('12.45').toString(), '149.40')
	t.equal(number('1.57').times('1.13').plus('1').toString(), '2.7741')

	t.end()
})

test('totally immutable baby', function(t) {
	var three = number('3')

	t.equal(three.times('4').toString(), '12')
	t.equal(three.times('3.00').toString(), '9.00')

	t.end()
})

test('works with number objects too', function(t) {
	var three = number('3')
	var four = number('4')

	t.equal(three.times(four).toString(), '12')
	t.end()
})

test('getPrecision', function(t) {
	t.equal(number('4').getPrecision(), 0)
	t.equal(number('5.77').getPrecision(), 2)

	t.end()
})

test('equality', function(t) {
	t.ok(number('13').equal('13.000'))
	t.notOk(number('13').equal('13.0000000001'))
	t.ok(number('13').equal('13'))
	t.ok(number('000013').equal('13.000'))

	t.end()
})

test('less than and greater than', function(t) {
	t.ok(number('13').lt('13.000001'))
	t.notOk(number('13').lt('13.000000'))

	t.ok(number('13').lte('13.000000'))
	t.notOk(number('13.0000001').lte('13.000000'))

	t.ok(number('13').gt('12'))
	t.notOk(number('13').gt('15'))
	t.ok(number('10').gte('8'))
	t.notOk(number('10').gte('10.000050505'))

	t.end()
})

test('changing precision with default trimming strategy', function(t) {
	t.equal(number('12.444').toString(0), '12', 'precision decreasing to 0')
	t.equal(number('0').changePrecision(5).toString(), '0.00000', 'precision increasing from 0')
	t.equal(number('1.11').toString(2), '1.11', 'same as existing precision')
	t.equal(number('12.888888').toString(3), '12.888', 'precision decreasing')
	t.equal(number('5.44').changePrecision(4).toString(), '5.4400', 'precision increasing')

	t.equal(number('-12.444').toString(0), '-12', 'negative number: precision decreasing to 0')
	t.equal(number('-0').changePrecision(5).toString(), '0.00000', 'negative number: precision increasing from 0')
	t.equal(number('-1.11').toString(2), '-1.11', 'negative number: same as existing precision')
	t.equal(number('-12.888888').toString(3), '-12.888', 'negative number: precision decreasing')
	t.equal(number('-5.44').changePrecision(4).toString(), '-5.4400', 'negative number: precision increasing')

	t.end()
})

test('changing precision by rounding', function(t) {
	t.equal(number('12.544').toString(0, number.round), '13', 'precision decreasing to 0')
	t.equal(number('0').changePrecision(5, number.round).toString(), '0.00000', 'precision increasing from 0')
	t.equal(number('1.55').toString(2, number.round), '1.55', 'same as existing precision')
	t.equal(number('12.888888').toString(3, number.round), '12.889', 'precision decreasing')
	t.equal(number('5.64').changePrecision(4, number.round).toString(), '5.6400', 'precision increasing')

	t.equal(number('-12.544').toString(0, number.round), '-13', 'negative number: precision decreasing to 0')
	t.equal(number('-0').changePrecision(5, number.round).toString(), '0.00000', 'negative number: precision increasing from 0')
	t.equal(number('-1.55').toString(2, number.round), '-1.55', 'negative number: same as existing precision')
	t.equal(number('-12.888888').toString(3, number.round), '-12.889', 'negative number: precision decreasing')
	t.equal(number('-5.64').changePrecision(4, number.round).toString(), '-5.6400', 'negative number: precision increasing')

	t.end()
})

test('currency formatting', function(t) {
	t.equal(number('-12345678.9').format({}), '-$12,345,678.90', 'default formatting')
	t.equal(number('-12345678.9').format({negative_after_currency: true}), '$-12,345,678.90', 'negative symbol after currency symbol')
	t.equal(number('-12345678.9').format({symbol_last: true}), '-12,345,678.90$', 'currency symbol after number')
	t.equal(number('-12345678.9').format({symbol_last: true, negative_after_currency: true}), '-12,345,678.90$', 'negative symbol still at front with currency symbol after number')
	t.equal(number('-12345678.9').format({thousands_separator: '+', decimal_separator: '^', currency_symbol: '@'}), '-@12+345+678^90', 'user-defined currency symbol and separators')
	t.equal(number('-12345678.9').format({decimal_places: 3}), '-$12,345,678.900', 'precision no rounding')
	t.equal(number('-12345678.09').format({decimal_places: 1, rounding_strategy: number.round}), '-$12,345,678.1', 'precision with rounding')
	t.equal(number('-12345678.009').format({rounding_strategy: number.round}), '-$12,345,678.01', 'no precision with rounding')
	t.equal(number('-12345678.98').format({decimal_places: 0}), '-$12,345,678', 'no decimal places with no rounding')
	t.equal(number('-12345678.98').format({decimal_places: 0, rounding_strategy: number.round}), '-$12,345,679', 'no decimal places with rounding')

t.equal(number('-12345678.9').format(), '-$12,345,678.90', 'no format object')
	t.equal(number('-12345678.9').toString({}), '-$12,345,678.90', 'default formatting using `toString` as a shortcut')

	t.end()
})
