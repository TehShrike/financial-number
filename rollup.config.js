import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
	input: `./index.js`,
	output: {
		format: `esm`,
		file: `./index.mjs`,
	},
	plugins: [
		commonjs(),
		resolve({
			browser: true,
			extensions: [ `.js` ],
		}),
	],
}
