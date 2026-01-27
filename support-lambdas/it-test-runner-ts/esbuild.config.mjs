import * as esbuild from 'esbuild';

await esbuild.build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	platform: 'node',
	target: 'node20',
	outfile: 'target/index.js',
	format: 'esm',
	sourcemap: true,
	minify: true,
	external: [
		'@aws-sdk/client-cloudwatch',
		'@aws-sdk/credential-provider-node',
	],
	banner: {
		js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
		`.trim(),
	},
});

console.log('Bundle created successfully');
