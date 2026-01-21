const entryPoints = require('./webpack.entryPoints').common;

const flattenedEntryPoints = [...Object.keys(entryPoints)].map(
	(key) => `assets/${entryPoints[key]}!`,
);

module.exports = {
	// ! signals that this is production code https://knip.dev/features/production-mode
	entry: [...flattenedEntryPoints, 'scripts/build-ssr-content.tsx!'],
	project: ['**/*.{js,jsx,ts,tsx,scss}!'],
	ignoreExportsUsedInFile: false,
	ignore: [
		'**/knip.*.js',
		// Ignore these files while the legacy checkout cleanup is ongoing. These
		// files all have unused exports, which knip complains about. Ignoring them
		// for now so that I can split this work across PRs to keep the size down.
		'assets/helpers/user/details.ts',
	],
	ignoreDependencies: [
		// used in package.json
		'@guardian/browserslist-config',
		'lint-staged',
		// could be used to run Chromatic locally
		'chromatic',
		'concurrently', // used in devrun.sh
		'@babel/runtime', // required by the build (errors without it)
		'@emotion/eslint-plugin', // used in eslint config for support-frontend
	],
	webpack: {
		entry: ['webpack.*.js'],
	},
};
