<!--js
var number = require('./')
-->

It's the **FINANCIAL ARITHMETICATOOOOOOOR!**

\**cough*\*

If you're doing math on financial numbers - invoice items, tax rates, those sorts of things - you can't ever afford to represent your numbers with floating point numbers.

Store them as [fixed-point types](https://dev.mysql.com/doc/refman/5.5/en/fixed-point-types.html) in the database, and in JavaScript, pass them around as strings to keep from possibly losing data.

Looking on npm I only found [one other module](https://github.com/ikr/money-math) that didn't taint values by converting them to or from the Number type, and it's hard-coded to a precision of two digits after the decimal point.

So I made this library.  It is built on [financial-arithmetic-functions](https://github.com/TehShrike/financial-arithmetic-functions), which is in turn built on the [jsbin](https://github.com/andyperlitch/jsbn) library.

I will add more methods as I need them.  If you run into an operation you need that is not yet implemented, feel free to open a pull request.

## Precision

This library increases the precision of the result based on its inputs.

With multiplication, the number of digits after the decimal point is the sum of the precision of both operands, e.g. `12.00 * 5.0` is `60.000`.

Addition and subtraction always result in the precision of the highest-precision of the operands: 12.00 + 5 is 17.00.

### Rounding

Even if you calculate the `15%` tax on a `99.99$` item to be `114.9885$`, that's not what you're going to print on the invoice or save to the database.

#### For display or storage

When you call `toString` to get a value to show the user, or to save in the database, you have the option of passing in a precision for the number to be displayed as.

By default, numbers will be trimmed - `number('114.9885').toString(2)` will return `114.98`.

If you prefer rounding, you can pass in the provided rounding strategy: `number('114.9885').toString(2, number.round)` will produce `114.99`.

If your business requirements call for a different rounding strategy, you can provide your own.  I would be happy to help you write it if you [open an issue](https://github.com/TehShrike/financial-arithmeticator/issues).

#### For calculation purposes

Say somebody buys `0.50` pounds of peanuts at `5.99` a pound, their subtotal would be `2.9950`.  You could calculate tax based on that subtotal, but that could produce a tax a penny different from what the user would calculate themselves based on the `2.99` subtotal printed on their receipt.

When you need to change the precision in cases like this, you can use the `changePrecision` function, which takes the new precision (and an optional rounding strategy like `toString`).  Like `toString`, it defaults to trimming.

```js
var subtotal = number('2.9950').changePrecision(2)
subtotal.toString() // => '2.99'
```

## Usage

`npm install financial-arithmeticator`, `var number = require('financial-arithmeticator')`

```js

number('11.0').minus('9').times('3.75').toString() // => '7.500'
number('99.99').times('1.15').gt('100') // => true

```

## API

- `number(string)`

Pass in the string representation of a number, get back a number object.

Numbers are immutable, and functions return a new number object.

Number objects have these methods.  They all take strings, or number objects.

- `num.plus(num)`
- `num.minus(num)`
- `num.times(num)`

### Comparisons

They return true or false.

- `num.gt(num)`
- `num.gte(num)`
- `num.lt(num)`
- `num.lte(num)`
- `num.equal(num)`

### Other utility methods

#### `num.changePrecision(newPrecision, [roundingStrategy])`

Takes a new precision, and an optional rounding strategy.  Returns a new number object.

```js
number('14.556').changePrecision(2, number.trim).toString() // => '14.55'
```

#### `num.toString([[displayPrecision], roundingStrategy])`

Returns a string representation of the number for display or storage.  You can specify the precision and rounding strategy to be passed to `changePrecision` if you like - by default, the number will display at its current precision.

```js
number('99.99').toString() // => '99.99'
```

#### `num.getPrecision()`

```js
number('99.99').getPrecision() // => 2
```

### `num.isNegative()`

```js
number('13').isNegative() // => false
number('13').times('-1').isNegative() // => true
```

## Other

I never use `this`, so you don't have to mess around with `bind` to do whatever wacky functional things you want, like this:

```js
var halved = ['10', '13', '50'].map(number('0.5').times)
```

Licensed [WTFPL](http://wtfpl2.com)
