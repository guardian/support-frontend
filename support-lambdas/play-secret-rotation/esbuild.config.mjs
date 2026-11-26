import { build } from 'esbuild';

build({
	entryPoints: ['typescript/index.ts'],
	bundle: true,
	platform: 'node',
	target: 'node24',
	outfile: 'target/typescript/index.js',
});
