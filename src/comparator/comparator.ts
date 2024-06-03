/* eslint-disable eqeqeq, no-eq-null */

import { AST_NODE_TYPES } from '@typescript-eslint/types'

import { type MemberNode, type MemberType, MemberTypes } from '../ast/member-like.js'
import { functionExpressions } from '../ast/types.js'
import { keyIdentifierName } from './key-identifier-name.js'
import { methodKind } from './method-kind.js'
import { select } from './select.js'

export const Order = {
	Less: -1,
	Equal: 0,
	Greater: 1,
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Order = (typeof Order)[keyof typeof Order]

export type Comparator<A> = (a: A, b: A) => number

export const C = {
	property<T, K extends keyof T>(key: K, comp: Comparator<T[K]>): Comparator<T> {
		return (a, b) => comp(a[key], b[key])
	},
	by<T, U>(_function: ($: T) => U, comp: Comparator<U>): Comparator<T> {
		return (a, b) => comp(_function(a), _function(b))
	},
	chain<T>(...comps: Array<Comparator<T>>): Comparator<T> {
		return (a, b) => {
			for (let comp of comps) {
				let result = comp(a, b)
				if (result !== Order.Equal) return result
			}

			return Order.Equal
		}
	},
	nop(): Order {
		return Order.Equal
	},
	defer(a: boolean, b: boolean): Order {
		if (Boolean(a) === Boolean(b)) return Order.Equal
		if (a) return Order.Greater
		return Order.Less
	},
	prefer(a: boolean, b: boolean): Order {
		if (Boolean(a) === Boolean(b)) return Order.Equal
		if (a) return Order.Less
		return Order.Greater
	},
	string(a: string, b: string): Order {
		if (a < b) return Order.Less
		if (b < a) return Order.Greater
		return Order.Equal
	},
	number(a: number, b: number): Order {
		if (a < b) return Order.Less
		if (b < a) return Order.Greater
		return Order.Equal
	},
	maybe<T>(comp: Comparator<T>): Comparator<T | undefined> {
		return (a, b) => {
			if (a == null) {
				if (b == null) return Order.Equal
				return Order.Greater
			}

			if (b == null) return Order.Less
			return comp(a, b)
		}
	},
	reverse<T>(comp: Comparator<T>): Comparator<T> {
		return (a, b) => comp(b, a)
	},
	capture<T, U extends T>(pred: (a: T) => a is U, comp: Comparator<U>): Comparator<T> {
		return (a, b) => {
			if (pred(a)) {
				if (pred(b)) return comp(a, b)
				return Order.Less
			}

			if (pred(b)) return Order.Greater
			return Order.Equal
		}
	},
}

export interface Options {
	sortMembersAlphabetically?: boolean
}

export function comparator(options: Partial<Options>): Comparator<MemberNode> {
	let isAlpha = options.sortMembersAlphabetically === true

	return C.chain<MemberNode>(
		// Signature
		C.capture(node(MemberTypes.TSIndexSignature), C.nop),

		// Field
		C.capture(
			select
				.or(node(MemberTypes.TSPropertySignature))
				.or(
					select.and(
						select
							.or(node(MemberTypes.PropertyDefinition))
							.or(node(MemberTypes.TSAbstractPropertyDefinition)),
						($) => !($.value && functionExpressions.includes($.value.type)),
					),
				),
			C.chain(
				// ClassMember(),
				// C.by(decorated, C.prefer),
				// C.by(abstracted, C.defer),
				// accessibility(),
				isAlpha ? keyIdentifierName() : C.nop,
			),
		),

		// Constructor signature for interface
		C.capture(
			select
				.or(node(MemberTypes.TSConstructSignatureDeclaration))
				.or(
					select.and(
						node(MemberTypes.MethodDefinition),
						($) =>
							$.key.type === AST_NODE_TYPES.Identifier &&
							$.key.name === 'constructor',
					),
				),
			C.by(($) => {
				if ($.type !== MemberTypes.TSConstructSignatureDeclaration) return 0
				return $.params?.length ?? 0
			}, C.number),
		),

		// Method
		C.capture(
			select
				.or(node(MemberTypes.TSMethodSignature))
				.or(node(MemberTypes.MethodDefinition))
				.or(node(MemberTypes.TSAbstractMethodDefinition))
				// .or(node(MemberTypes.TSDeclareMethod))
				// .or(select.and(bt.isNode, select.or(bt.isClassMethod).or(bt.isClassPrivateMethod)))
				.or(
					select.and(
						node(MemberTypes.PropertyDefinition),
						($) => $.value != null && functionExpressions.includes($.value.type),
					),
				)
				.or(node(MemberTypes.TSPropertySignature)),
			C.chain(
				methodKind(),
				// ClassMember(),
				// C.by(decorated, C.prefer),
				// C.by(abstracted, C.defer),
				// accessibility(),
				isAlpha ? keyIdentifierName() : C.nop,
			),
		),
	)
}

function node<K extends MemberType>(key: K) {
	return function (node: MemberNode): node is MemberNode<K> {
		return node.type === key
	}
}
