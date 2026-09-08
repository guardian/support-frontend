import { build } from 'esbuild';

build({
	entryPoints: ['src/server.ts'],
	bundle: true,
	sourcemap: true,
	platform: 'node',
	target: 'node24', // Keep in sync with Node version of EC2 image
	outdir: 'target',
});
