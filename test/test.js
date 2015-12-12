var test = require('tape')
var number = require('../')

test('adding and subtracting', function(t) {
	t.equal('500.500', number('100').plus('400.500').toString())
	t.equal('12.320', number('12.12').plus('12.2').minus('12.000').toString())
	t.equal('0', number('-10').plus('10').toString())

	t.end()
})

test('multiplication and whatever', function(t) {
	t.equal('149.40', number('12').times('12.45').toString())
	t.equal('2.7741', number('1.57').times('1.13').plus('1').toString())

	t.end()
})

test('totally immutable baby', function(t) {
	var three = number('3')

	t.equal('12', three.times('4').toString())
	t.equal('9.00', three.times('3.00').toString())

	t.end()
})

test('works with number objects too', function(t) {
	var three = number('3')
	var four = number('4')

	t.equal('12', three.times(four).toString())
	t.end()
})
