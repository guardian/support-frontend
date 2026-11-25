import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const lambdasRoot = fileURLToPath(
	new URL(
		'./node_modules/@guardian/support-service-lambdas/modules',
		import.meta.url,
	),
);

// eslint-disable-next-line import/no-default-export -- vitest needs this to be a default export
export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^@modules\/internationalisation\/(.*)$/,
				replacement: `${lambdasRoot}/internationalisation/src/$1`,
			},
		],
	},
});
