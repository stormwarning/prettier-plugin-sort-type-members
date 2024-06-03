import { AST_NODE_TYPES } from '@typescript-eslint/types'

import type { Node } from '../ast/types.js'
import { C, type Comparator } from './comparator.js'

export const keyIdentifierName = (): Comparator<Node> =>
	C.by(($) => {
		if ('key' in $) {
			switch ($.key.type) {
				case AST_NODE_TYPES.Identifier:
				case AST_NODE_TYPES.PrivateIdentifier:
					if ('computed' in $ && $.computed) return undefined
					return $.key.name
				case AST_NODE_TYPES.Literal: {
					let { value } = $.key
					if (typeof value !== 'string') return undefined
					return value
				}

				default:
					return undefined
			}

			//
			// if (isNode($.key)) {
			// 	// Babel nodes
			// 	switch (true) {
			// 		case isPrivateName($.key):
			// 			if ($.key.id.type !== AST_NODE_TYPES.Identifier) return null
			// 			return $.key.id.name
			// 		case isStringLiteral($.key):
			// 			return $.key.value
			// 	}
			// }
		}

		return undefined
	}, C.maybe(C.string))
