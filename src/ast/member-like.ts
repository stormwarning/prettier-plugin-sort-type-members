import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/types'

export const MemberLikeNodeTypesArray = [
	AST_NODE_TYPES.PropertyDefinition,
	AST_NODE_TYPES.MethodDefinition,
	AST_NODE_TYPES.TSAbstractMethodDefinition,
	AST_NODE_TYPES.TSAbstractPropertyDefinition,
	AST_NODE_TYPES.TSConstructSignatureDeclaration,
	AST_NODE_TYPES.TSIndexSignature,
	AST_NODE_TYPES.TSMethodSignature,
	AST_NODE_TYPES.TSPropertySignature,
] as const

export const MemberTypes = Object.fromEntries(
	MemberLikeNodeTypesArray.map((type) => [type, type]),
) as { [K in MemberType]: K }

export type MemberType = (typeof MemberLikeNodeTypesArray)[number]

export type MemberNode<K extends MemberType = MemberType> = (
	| never // Avoid a Prettier bug.
	| TSESTree.PropertyDefinition
	| TSESTree.MethodDefinition
	| TSESTree.TSAbstractMethodDefinition
	| TSESTree.TSAbstractPropertyDefinition
	| TSESTree.TSConstructSignatureDeclaration
	| TSESTree.TSIndexSignature
	| TSESTree.TSMethodSignature
	| TSESTree.TSPropertySignature
) & { type: K }
