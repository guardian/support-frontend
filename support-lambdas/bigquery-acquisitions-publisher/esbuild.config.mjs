import { build } from 'esbuild';
import tsconfigPaths from 'esbuild-ts-paths';

build({
	entryPoints: ['typescript/index.ts'],
	bundle: true,
	platform: 'node',
	target: 'node24',
	outfile: 'target/typescript/index.js',
	plugins: [tsconfigPaths()],
});

