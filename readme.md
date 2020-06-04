<!--js
var number = require('./')
-->

A number object that is safe to use for financial numbers.  Won't ever convert your numbers to floating point!

## JS engine support

The `financial-number@1` uses a JS bigint implementation under the hood.  2.x uses the `BigInt` support (available in node 10.8+ and [most modern browsers](https://caniuse.com/#feat=bigint)).

## Premise

If you're doing math on financial numbers - invoice items, tax rates, those sorts of things - you can't ever afford to represent your numbers with floating point numbers.

Store them as [fixed-point types](https://dev.mysql.com/doc/refman/5.5/en/fixed-point-types.html) in the database, and in JavaScript, pass them around as strings to keep from possibly losing data.

## Precision

This library increases the precision of the result based on its inputs.

With multiplication, the number of digits after the decimal point is the sum of the precision of both operands, e.g. `12.00 * 5.0` is `60.000`.

Addition and subtraction always result in the precision of the highest-precision of the operands: `12.00 + 5` is `17.00`.

### Rounding

Even if you calculate the `15%` tax on a `99.99$` item to be `114.9885$`, that's not what you're going to print on the invoice or save to the database.

#### For display or storage

When you call `toString` to get a value to show the user, or to save in the database, you have the option of passing in a precision for the number to be displayed as.

By default, numbers will be trimmed - `number('114.9885').toString(2)` will return `114.98`.

If you prefer rounding, you can pass in the provided rounding strategy: `number('114.9885').toString(2, number.round)` will produce `114.99`.

If your business requirements call for a different rounding strategy, you can provide your own.  I would be happy to help you write it if you [open an issue](https://github.com/TehShrike/financial-number/issues).

#### For calculation purposes

Say somebody buys `0.50` pounds of peanuts at `5.99` a pound, their subtotal would be `2.9950`.  You could calculate tax based on that subtotal, but that could produce a tax a penny different from what the user would calculate themselves based on the `2.99` subtotal printed on their receipt.

When you need to change the precision in cases like this, you can use the `changePrecision` function, which takes the new precision (and an optional rounding strategy like `toString`).  Like `toString`, it defaults to trimming.

```js
var subtotal = number('2.9950').changePrecision(2)
subtotal.toString() // => '2.99'
```

## Usage

`npm install financial-number`, `var number = require('financial-number')`

```js

number('11.0').minus('9').times('3.75').toString() // => '7.500'
number('99.99').times('1.15').gt('100') // => true

```

## API

- `number(string)`

```js
var numberValue = number('50.0')
```

Pass in the string representation of a number, get back a financial number object.

Financial numbers are immutable, and functions return a new number object.

Financial number objects have these methods.  The operations and comparisons all take strings, or financial number objects.

### Operations

- `numberValue.plus(num)`
- `numberValue.minus(num)`
- `numberValue.times(num)`

### Comparisons

They return true or false.

- `numberValue.gt(num)`
- `numberValue.gte(num)`
- `numberValue.lt(num)`
- `numberValue.lte(num)`
- `numberValue.equal(num)`

### Other utility methods

#### `numberValue.changePrecision(newPrecision, [roundingStrategy])`

Takes a new precision, and an optional rounding strategy.  Returns a new number object.  See [Rounding](#rounding)

```js
number('14.556').changePrecision(2, number.trim).toString() // => '14.55'
```

#### `numberValue.toString([displayPrecision, [roundingStrategy]])`

Returns a string representation of the number for display or storage.  You can specify the precision and rounding strategy to be passed to `changePrecision` if you like - by default, the number will display at its current precision.  See [Rounding](#rounding)

```js
number('99.99').toString() // => '99.99'
```

#### `numberValue.getPrecision()`

```js
number('99.99').getPrecision() // => 2
```

#### `numberValue.isNegative()`

```js
number('13').isNegative() // => false
number('13').times('-1').isNegative() // => true
```

## Running the tests/contributing

```sh
git clone https://github.com/TehShrike/financial-number.git
cd financial-number
npm install
npm test
```

## Other

I never use `this`, so you don't have to mess around with `bind` to do whatever wacky functional things you want, like this:

```js
var halved = ['10', '13', '50'].map(number('0.5').times)
```

Licensed [WTFPL](http://wtfpl2.com)
