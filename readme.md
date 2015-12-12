It's the FINANCIAL ARITHMETICATOOOOOOOR!

\**cough*\*

If you're doing math on financial numbers - invoice items, tax rates, those sorts of things - you can't ever afford to represent your numbers with floating point numbers.

Store them as [fixed-point types](https://dev.mysql.com/doc/refman/5.5/en/fixed-point-types.html) in the database, and in JavaScript, pass them around as strings to keep from possibly losing data.

Looking on npm I only found [one other module](https://github.com/ikr/money-math) that didn't taint values by converting them to or from the Number type, and it's hard-coded to a precision of two digits after the decimal point.

## Precision

This library increases the precision of the result based on its inputs.

With multiplication, the number of digits after the decimal point is the sum of the precision of both operands, e.g. 12.00 * 5.0 is 60.000.

Addition and subtraction always result in the precision of the highest-precision of the operands: 12.00 + 5 is 17.00.

## Usage

`npm install financial-arithmeticator`, `var number = require('financial-arithmeticator')`

<!--js
var number = require('./')
-->

```js

number('11.0').minus('9').times('3.75').toString() // => 7.50

```

## API

- `number(string)`

Pass in the string representation of a number, get back a number object.

Numbers are immutable, and functions return a new number object.

Number objects have these methods.  They all take strings, or number objects.

- `num.plus(num)`
- `num.minus(num)`
- `num.times(num)`

Other utility methods:

- `num.toString()`

## Other

I never use `this`, so you don't have to mess around with `bind` to do whatever wacky functional things you want, like this:

```js
var halved = ['10', '13', '50'].map(number('0.5').times)
```

Licensed [WTFPL](http://wtfpl2.com)
