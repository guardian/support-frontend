import { defineConfig } from 'vitest/config';

const lambdasRoot = './node_modules/@guardian/support-service-lambdas/modules';

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^@modules\/internationalisation\/(.*)$/,
				replacement: `${lambdasRoot}/internationalisation/src/$1`,
			},
			{ find: /^@modules\/(.*)$/, replacement: `${lambdasRoot}/$1` },
		],
	},
});
