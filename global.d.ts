import type { Printer } from 'prettier'

module 'prettier/plugins/estree' {
	// eslint-disable-next-line prefer-let/prefer-let
	export declare const printers: { estree: Printer }
}
