module.exports = {
	common: {
		'[countryGroupId]/router': 'pages/[countryGroupId]/router.tsx',
		'[countryGroupId]/events/router':
			'pages/[countryGroupId]/events/router.tsx',
		favicons: 'images/favicons.ts',
		subscriptionsLandingPage:
			'pages/subscriptions-landing/subscriptionsLanding.tsx',
		supporterPlusLandingPage:
			'pages/supporter-plus-landing/supporterPlusRouter.tsx',
		paperSubscriptionLandingPage:
			'pages/paper-subscription-landing/paperSubscriptionLandingPage.tsx',
		paperSubscriptionCheckoutPage:
			'pages/paper-subscription-checkout/paperSubscriptionCheckout.tsx',
		weeklySubscriptionLandingPage:
			'pages/weekly-subscription-landing/weeklySubscriptionLanding.tsx',
		weeklySubscriptionCheckoutPage:
			'pages/weekly-subscription-checkout/weeklySubscriptionCheckout.tsx',
		subscriptionsRedemptionPage:
			'pages/subscriptions-redemption/subscriptionsRedemption.tsx',
		digitalSubscriptionLandingPage:
			'pages/digital-subscriber-checkout/digitalSubscriptionRouter.tsx',
		payPalErrorPage: 'pages/paypal-error/payPalError.tsx',
		payPalErrorPageStyles: 'pages/paypal-error/payPalError.scss',
		error404Page: 'pages/error/error404.tsx',
		error500Page: 'pages/error/error500.tsx',
		downForMaintenancePage: 'pages/error/maintenance.tsx',
		unsupportedBrowserStyles:
			'stylesheets/fallback-pages/unsupportedBrowser.scss',
		contributionsRedirectStyles:
			'stylesheets/fallback-pages/contributionsRedirect.scss',
		promotionTerms: 'pages/promotion-terms/promotionTerms.tsx',
		ausMomentMap: 'pages/aus-moment-map/ausMomentMap.tsx',
	},
	ssr: {
		ssrPages: 'helpers/rendering/ssrPages.ts',
	},
};
