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
