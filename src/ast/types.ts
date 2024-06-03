import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/types'

export const functionExpressions: NodeTypes[] = [
	AST_NODE_TYPES.FunctionExpression,
	AST_NODE_TYPES.ArrowFunctionExpression,
]

export type NodeTypes = AST_NODE_TYPES
export type Node<T extends NodeTypes = NodeTypes> = TSESTree.Node & {
	type: T
}
