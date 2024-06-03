import { visitorKeys as esVisitorKeys } from '@typescript-eslint/visitor-keys'

import type { Node } from './ast/types.js'

export function visit<T extends Node>(node: T, modifier: <S extends Node>(node: S) => S): T {
	if (node?.type === null || node?.type === undefined) return node

	let modified = cloneNode(modifier(node))
	let keys = new Set(esVisitorKeys[modified.type] ?? []) as Set<keyof T>

	for (let key of keys) {
		let k = key
		let child = modified[k]
		if (Array.isArray(child)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			modified[k] = child.map((c) => visit(c, modifier)) as T[typeof k]
			continue
		}

		modified[k] = visit(modified[k] as Node, modifier) as T[typeof k]
	}

	return modified
}

function cloneNode<N extends Node>(node: N): N {
	return { ...node }
}
