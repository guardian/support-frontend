const entryPoints = require('./webpack.entryPoints').common;

const flattenedEntryPoints = [...Object.keys(entryPoints)].map(
	(key) => `assets/${entryPoints[key]}!`,
);

module.exports = {
	// ! signals that this is production code https://knip.dev/features/production-mode
	entry: [
		...flattenedEntryPoints,
		'scripts/build-ssr-content.tsx!',
		'assets/pages/[countryGroupId]/checkout.tsx!',
		'assets/pages/[countryGroupId]/guardianAdLiteLanding/guardianAdLiteLanding.tsx!',
		'assets/pages/[countryGroupId]/landingPage.tsx!',
		'assets/pages/[countryGroupId]/oneTimeCheckout.tsx!',
		'assets/pages/[countryGroupId]/student/StudentLandingPageGlobalContainer.tsx!',
		'assets/pages/[countryGroupId]/student/StudentLandingPageUTSContainer.tsx!',
		'assets/pages/[countryGroupId]/thankYou.tsx!',
	],
	project: ['**/*.{js,jsx,ts,tsx}!'],
	ignoreExportsUsedInFile: false,
	ignore: ['**/knip.*.js'],
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
