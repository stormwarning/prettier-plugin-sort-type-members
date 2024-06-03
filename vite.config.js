import { defineConfig } from 'vitest/config'

export default defineConfig({
	build: {
		lib: {
			entry: './src/index.ts',
			formats: ['es'],
			fileName: () => 'index.js',
		},
		minify: false,
		rollupOptions: {
			external: [
				'prettier',
				'@babel/types',
				'@typescript-eslint/visitor-keys',
				'@typescript-eslint/types',
			],
		},
	},
	test: {
		globals: true,
		environment: 'node',
		// Include: 'tests/**/*.ts',
	},
})
