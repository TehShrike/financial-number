A number object that is safe to use for financial numbers.  Won't ever convert your numbers to floating point!

## JS engine support

Starting with version 2, `financial-number` uses [native `BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt), which is supported in node 10.8+ and [modern browsers](https://caniuse.com/#feat=bigint).

## Premise

If you're doing math on financial numbers - invoice items, tax rates, those sorts of things - you can't ever afford to represent your numbers with floating point numbers.

Store them as [exact/fixed-point types](https://dev.mysql.com/doc/refman/8.0/en/fixed-point-types.html) in the database, and in JavaScript, pass them around as strings to avoid losing data.

## Decimal places

The decimal places (the number of significant digits after the decimal point) of an operation's result is based on the decimal places of its inputs.

With multiplication, the number of digits after the decimal point is the sum of the decimal places of both operands, e.g. `12.00 * 5.0` is `60.000`.

Addition and subtraction always result in the decimal places of the highest-decimal-places of the operands: `12.00 + 5` is `17.00`.

### Why does this matter?

Imagine you are calculating the subtotal, tax, and total for an invoice.

The customer is purchasing 1.5 sheets of plywood at 24.99$ per unit.

The tax rate is 14%.

Calculating it out: the subtotal is 37.485, tax to collect is 5.2479, and the invoice total is 42.7329.

Now, you can't actually charge your customers in increments less than .01$, and customers aren't used to seeing fractional cents on their invoices. so you trim all the numbers to two places after the decimal on their receipt: subtotal of 37.48, tax of 5.24, total 42.73.

...except now the customers will be even more confused, because the subotal and the tax add up to a different number than the total (42.72).

(Note that the numbers still add up wrong even if you round the numbers to the nearest cent rather than trimming!  Subtotal 37.49 + tax 5.25 = 42.74)

#### How to fix it

You can either continue calculating subtotal/tax/total like this and explain the business logic to your customers every time they ask you why the numbers don't add up, or you can round your numbers to two decimal places before you add them together.

(This may not actually be okay!  Ask your accountant.)

```ts
const subtotal = number('1.5').times('24.99')
const rounded_subtotal = subtotal.changeDecimalPlaces(2)
rounded_subtotal.toString() // => '37.48'

const tax = rounded_subtotal.times('0.14')
const rounded_tax = tax.changeDecimalPlaces(2)
rounded_tax.toString() // => '5.24'

const total = rounded_subtotal.plus(rounded_tax)
total.toString() // => '42.72'
```

### Decimal places general principle

Whenever you need to display or store a number with a specific number of digits after the decimal place, you should explicity set that number to the correct decimal places before using it in any further calculations.

## Rounding methods

When changing the decimal places of a number, you can choose how you want the number rounded.

By default, numbers will be trimmed - `number('114.9885').toString(2)` will return `114.98`.

If you prefer rounding, you can pass in the provided rounding strategy: `number('114.9885').toString(2, number.round)` will produce `114.99`.

You can access the rounding methods as properties of the default export/`number` function, or by importing them directly:

```ts
import number, { round, trim } from 'financial-number'
```

### Which one should you use?

In general, the IRS probably won't care which method you use as long as you use it everywhere consistently.  In practice, ask your accountant.

If your accountant tells you you need some other rounding strategy, you can bring your own custom rounding strategy.

### Custom rounding strategies

You can write your own rounding implementation – rounding functions take two arguments: a financial-number data structure, and a bigint representing the desired number of digits after the decimal point.

```ts
type RoundingStrategy = (number: { value: bigint, decimal_places: bigint }, targetDecimalPlaces: bigint) => { value: bigint, decimal_places: bigint }
```

## Data structure/storage

Internally, financial numbers use this data structure:

```ts
type FinancialNumberValue = {
	value: bigint
	decimal_places: bigint
}
```

when you pass in a string, it is converted to this data structure.

You can call `valueOf` to get this data structure.

When displaying or saving to your database, it will probably be more convenient to call `toString`.  When storing in your database, use an arbitrary-precision numeric type, `NUMERIC` or `DECIMAL` in SQL-land.

## Usage

```sh
npm install financial-number
```

```ts
import number from 'financial-number'

number('11.0').minus('9').times('3.75').toString() // => '7.500'
number({ value: 110n, decimal_places: 1n }).minus({ value: 9n, decimal_places: 0 }).times({ value: 375n, decimal_places: 2n }).toString() // => '7.500'
```

### Default to your preferred rounding strategy

So that if you want a different default (besides the default default `trim`), you don't have to pass in your chosen strategy every time you call `toString` or `changeDecimalPlaces`.

```ts
import { round, withDefaultRoundingStrategy } from 'financial-number'

const number = withDefaultRoundingStrategy(round)

export default number
```

## API

- `number(string | { value: bigint, decimal_places: bigint })`

```ts
const numberValue = number('50.0')
const equivalentNumberValue = number({ value: 500n, decimal_places: 1n })
```

Pass in the string representation of a number, get back a financial number object.

Financial numbers are immutable, and functions return a new number object.

Financial numbers have these methods.  Most operations and comparisons will accept number argument as strings, financial numbers, bigints, or the underlying data structure returned by `valueOf`.

### Operations

- `numberValue.plus(num)`
- `numberValue.minus(num)`
- `numberValue.times(num)`
- `numberValue.mod(num)`
- `numberValue.pow(exponent)` - exponent is a `bigint`

### Comparisons

They return true or false.

- `numberValue.gt(num)`
- `numberValue.gte(num)`
- `numberValue.lt(num)`
- `numberValue.lte(num)`
- `numberValue.equal(num)`

### Other utility methods

#### `numberValue.changeDecimalPlaces(newDecimalPlaces, [roundingStrategy])`

Takes a new decimal places value, and an optional rounding strategy.  Returns a new number object.  See [Rounding methods](#rounding-methods)

```ts
number('14.556').changeDecimalPlaces(2, number.trim).toString() // => '14.55'
```

#### `numberValue.toString([displayDecimalPlaces, [roundingStrategy]])`

Returns a string representation of the number for display or storage.  You can specify the decimal places and rounding strategy to be passed to `changeDecimalPlaces` if you like - by default, the number will display at its current decimal places.  See [Rounding methods](#rounding-methods)

```ts
number('99.99').toString() // => '99.99'
```

#### `numberValue.getDecimalPlaces()`

Returns a bigint.

```ts
number('99.99').getDecimalPlaces() // => BigInt(2)
```

#### `numberValue.isNegative()`

```ts
number('13').isNegative() // => false
number('13').times('-1').isNegative() // => true
```

#### `numberValue.valueOf()`

Returns the underlying object with `value` and `decimal_places` as bigints.

```ts
number('99.99').valueOf() // => { value: 9999n, decimal_places: 2n }
number('-5.5').valueOf() // => { value: -55n, decimal_places: 1n }
```

#### `numberValue.toJSON()`

Returns a string representation of the underlying value for the benefit of `JSON.stringify`.  Rather than leaning on this, I would recommend serializing your data with something like [`@tehshrike/json_anything`](https://github.com/TehShrike/json_anything).

```ts
number({ value: 9999n, decimal_places: 2n }).toJSON() // => '99.99'
```

## Running the tests/contributing

```sh
git clone https://github.com/TehShrike/financial-number.git
cd financial-number
pnpm install
pnpm test
```

## Other

I never use `this`, so you don't have to mess around with `bind` to do whatever wacky functional things you want, like this:

```ts
const halved = ['10', '13', '50'].map(number('0.5').times)
```

Licensed [WTFPL](http://wtfpl2.com)
