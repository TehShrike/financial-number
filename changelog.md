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
