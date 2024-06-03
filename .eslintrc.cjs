/** @type {import('eslint').Linter.Config} */
const config = {
	root: true,
	ignorePatterns: ['**/fixtures/**'],
	extends: ['@zazen', '@zazen/eslint-config/typescript', 'prettier'],
	overrides: [
		{
			files: ['*.test.ts'],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = config
