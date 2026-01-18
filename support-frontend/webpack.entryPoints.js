module.exports = {
	common: {
		'[countryGroupId]/router': 'pages/[countryGroupId]/router.tsx',
		'[countryGroupId]/events/router':
			'pages/[countryGroupId]/events/router.tsx',
		favicons: 'images/favicons.ts',
		subscriptionsLandingPage:
			'pages/subscriptions-landing/subscriptionsLanding.tsx',
		paperSubscriptionLandingPage:
			'pages/paper-subscription-landing/paperSubscriptionLandingPage.tsx',
		weeklySubscriptionLandingPage:
			'pages/weekly-subscription-landing/weeklySubscriptionLanding.tsx',
		payPalErrorPage: 'pages/paypal-error/payPalError.tsx',
		error404Page: 'pages/error/error404.tsx',
		error500Page: 'pages/error/error500.tsx',
		downForMaintenancePage: 'pages/error/maintenance.tsx',
    unsupportedBrowserPage: 'pages/unsupported-browser/unsupportedBrowserRender.tsx',
		contributionsRedirectStyles:
			'stylesheets/fallback-pages/contributionsRedirect.scss',
		promotionTerms: 'pages/promotion-terms/promotionTerms.tsx',
		ausMomentMap: 'pages/aus-moment-map/ausMomentMap.tsx',
	},
};
