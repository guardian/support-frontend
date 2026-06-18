import { build } from 'esbuild';
import tsconfigPaths from 'esbuild-ts-paths';

build({
	entryPoints: ['src/typescript/lambdas/*.ts'],
	bundle: true,
	sourcemap: true,
	platform: 'node',
	target: 'node22',
	outdir: 'target/typescript',
	plugins: [tsconfigPaths()],
});
