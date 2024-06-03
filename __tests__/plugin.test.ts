import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ESLint } from 'eslint'
import { format } from 'prettier'
import { describe, expect, test } from 'vitest'

const plugins = ['./dist/index.js']

const fixtures = join(import.meta.dirname, 'fixtures')
const filenames = await readdir(fixtures)
const options = [{}, { sortMembersAlphabetically: true }, { sortMembersAlphabetically: false }]

describe.each(options)('format, %j', (_options) => {
	test.each(filenames)('%s', async (name) => {
		let path = join(fixtures, name)
		let code = await readFile(path, 'utf8')
		let result = await format(code, {
			..._options,
			filepath: path,
			plugins,
		})

		expect(result).toMatchSnapshot()
	})

	describe('idempotency', () => {
		test.each(filenames)('%s', async (name) => {
			let path = join(fixtures, name)
			let code = await readFile(path, 'utf8')
			let result1 = await format(code, {
				..._options,
				filepath: path,
				plugins,
			})
			let result2 = await format(result1, {
				..._options,
				filepath: path,
				plugins,
			})

			expect(result2).toEqual(result1)
		})
	})

	//
	// describe('parser agnostic', () => {
	// 	describe('TypeScript', () => {
	// 		let skipFile = new Set(['issue-34-literal-keys.js'])
	// 		let parsers = ['typescript', 'babel-ts']
	// 		describe.each(parsers)('%s', async (parser) => {
	// 			test.each(filenames.filter((n) => !skipFile.has(n)))('%s', async (name) => {
	// 				let path = join(dir, name)
	// 				let code = await readFile(path, 'utf-8')
	// 				let expected = await format(code, {
	// 					..._options,
	// 					filepath: path,
	// 					plugins,
	// 				})
	// 				let actual = await format(code, {
	// 					..._options,
	// 					filepath: path,
	// 					plugins,
	// 					parser,
	// 				})
	// 				expect(actual).toBe(expected)
	// 			})
	// 		})
	// 	})
	// })

	// describe('compatible with eslint-typescript', () => {
	// 	let eslint = new ESLint({
	// 		overrideConfig: {
	// 			parser: '@typescript-eslint/parser',
	// 			plugins: ['@typescript-eslint'],
	// 			extends: [],
	// 			rules: {
	// 				'@typescript-eslint/member-ordering': 'error',
	// 			},
	// 		},
	// 		useEslintrc: false,
	// 	})

	// 	test.each(filenames)('%s', async (name) => {
	// 		let path = join(dir, name)
	// 		let code = await readFile(path, 'utf-8')
	// 		let result = await format(code, {
	// 			..._options,
	// 			filepath: path,
	// 			plugins,
	// 		})

	// 		let lintResults = await eslint.lintText(result)

	// 		expect(lintResults).toHaveLength(1)
	// 		expect(lintResults[0].messages).toBeEmpty()
	// 	})
	// })
})
