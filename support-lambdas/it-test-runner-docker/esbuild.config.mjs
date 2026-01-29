import { build } from 'esbuild';

build({
	entryPoints: ['src/handler.ts'],
	bundle: true,
	sourcemap: true,
	platform: 'node',
	target: 'node22',
	outdir: 'target',
});
