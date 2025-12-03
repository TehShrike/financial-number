# 5.0.0

The internal data structure has been fully transitioned from strings to bigints.  You can still pass in strings to all the functions like before, but they are immediately converted to two bigints: one storing the full value, and one storing the number of digits after the decimal place.  This reduces lines of code and should increase performance quite a bit.

## Breaking changes

- the term "precision" has been changed to "decimal places", causing two of the functions to have their names changed
	- `changePrecision()` -> `changeDecimalPlaces()`
	- `getPrecision()` -> `getDecimalPlaces()`
- precision/decimal places are now returned as a `bigint`, not a `number`
- custom rounding strategies have a completely different type signature.  See <readme.md#custom-rounding-strategies>.
	- The new type signature for rounding strategies is `(number: { value: bigint, decimal_places: bigint }, targetDecimalPlaces: bigint) => { value: bigint, decimal_places: bigint }`
	- Your usage of the built-in rounding strategies won't change at all.

## Additions

- precision/decimal places can now be passed into method arguments as a `bigint` in addition to a `number`
- a new `valueOf` function that returns the new internal data structure: `{ value: bigint, decimal_places: bigint }`
- in addition to strings and FinancialNumbers, all functions will also accept an object with `value` and `decimal_places` bigints as a valid number

# 4.0.5

- Upgrade TypeScript
- Switch to built-in node testing library
- Prevent the original .ts files from being published to npm

# 4.0.4

- Include the type definition in the export map

# 4.0.3

- Export the package.json file [#17](https://github.com/TehShrike/financial-number/pull/17)

# 4.0.2

- Export types harder this time

# 4.0.1

- Include the type file in the package.json maybe?

# 4.0.0

- Now written in TypeScript, shipping with TS types!
- I tried to make this change perfectly backward-compatible, but I'm publishing it as a major version bump out of a hoovercurfundance of caution

# 3.2.0

- added `withDefaultRoundingStrategy` export to the entry point so you can get a `number` function that defaults to your preferred strategy

# 3.1.0

- added `mod` method for your modulo needs

# 3.0.0

- added a `toJSON` method that returns the string value of the number
- input strings are now validated immediately when passed to the `number` function rather than later when you call a method

# 2.0.0

- Use native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) rather than [jsbn](https://github.com/andyperlitch/jsbn)

# 1.1.0

- Exposed a ES Module in addition to the CommonJS entry point
