import { type MemberNode, MemberTypes } from '../ast/member-like.js'
import { C, type Comparator } from './comparator.js'

export function methodKind<T extends MemberNode>(): Comparator<T> {
	return C.by(($) => 3, C.number)
}

// Looks like a lot of this is specific to Class members so removing for now.
// export function methodKind<T extends MemberNode>(): Comparator<T> {
// 	return C.by(($) => {
// 		switch ($.type) {
// 			case MemberTypes.TSMethodSignature:
// 			case MemberTypes.MethodDefinition:
// 			case MemberTypes.TSAbstractMethodDefinition:
// 				switch ($.kind) {
// 					case 'constructor':
// 						return 0
// 					case 'get':
// 						return 1
// 					case 'set':
// 						return 2
// 					case 'method':
// 						return 3
// 				}

// 			default:
// 				return 3
// 		}
// 	}, C.number)
// }
