import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/types'
import type { AST } from 'prettier'

import { MemberLikeNodeTypesArray, type MemberNode } from './ast/member-like.js'
import type { Node } from './ast/types.js'
import { type Options, comparator, C } from './comparator/comparator.js'
import { visit } from './visit.js'

export function preprocess(ast: AST, options: unknown): AST {
	let memcomp = comparator(options as Options)
	let comp = C.capture(memberNodes, memcomp)

	return visit(ast, <T extends Node>(node: T): T => {
		switch (node.type) {
			case AST_NODE_TYPES.TSInterfaceBody:
				return {
					...node,
					body: [...node.body].sort(comp),
				} satisfies TSESTree.TSInterfaceBody as T
			//
			// case AST_NODE_TYPES.ClassBody:
			// 	return {
			// 		...node,
			// 		body: [...node.body].sort(comp),
			// 	} as TSESTree.ClassBody as T
			case AST_NODE_TYPES.TSTypeLiteral:
				return {
					...node,
					members: [...node.members].sort(comp),
				} satisfies TSESTree.TSTypeLiteral as T
			default:
				return node
		}
	})
}

function memberNodes(node: Node): node is MemberNode {
	return membersSet.has(node.type)
}

const membersSet = new Set<Node['type']>(MemberLikeNodeTypesArray)
