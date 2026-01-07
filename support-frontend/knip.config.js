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
		'assets/helpers/redux/checkout/address/actions.ts',
		'assets/helpers/redux/checkout/address/reducer.ts',
		'assets/helpers/redux/checkout/addressMeta/actions.ts',
		'assets/helpers/redux/checkout/giftingState/actions.ts',
		'assets/helpers/redux/checkout/payment/payPal/reducer.ts',
		'assets/helpers/redux/checkout/payment/stripeAccountDetails/reducer.ts',
		'assets/helpers/redux/checkout/personalDetails/actions.ts',
		'assets/helpers/redux/checkout/product/actions.ts',
		'assets/helpers/redux/checkout/product/selectors/productPrice.ts',
		'assets/helpers/tracking/googleTagManager.ts',
		'assets/helpers/tracking/quantumMetric.ts',
		'assets/helpers/user/details.ts',
	],
	ignoreDependencies: [
		// used in package.json
		'@guardian/browserslist-config',
		'lint-staged',
		// could be used to run Chromatic locally
		'chromatic',
		'concurrently', // used in devrun.sh
		'sass-mq', // imported from breakpoints.scss
		'@babel/runtime', // required by the build (errors without it)
		'@emotion/eslint-plugin', // used in eslint config for support-frontend
	],
	webpack: {
		entry: ['webpack.*.js'],
	},
};
