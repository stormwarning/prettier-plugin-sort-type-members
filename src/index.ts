/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { AST } from 'prettier'
import { printers as estreePrinters } from 'prettier/plugins/estree'

import { preprocess } from './preprocess.js'

const originalPreprocess = estreePrinters.estree.preprocess ?? ((x: AST) => x)

estreePrinters.estree.preprocess = (x, options) =>
	preprocess(originalPreprocess(x, options), options)

export const options = {
	optionalityOrder: {
		type: 'choice',
		choices: [
			{ value: 'required-first', description: 'Group required members first.' },
			{ value: 'optional-first', description: 'Group optional members first.' },
			{ value: 'any', description: 'Optional and required members grouped together.' },
		],
		category: 'JavaScript',
		default: 'required-first',
	},
	sortMembersAlphabetically: {
		type: 'boolean',
		category: 'Global',
		default: false,
		description: 'Sort members alphabetically. Other criteria such as visibility precedes.',
	},
}
