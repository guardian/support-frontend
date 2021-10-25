import * as React from 'react';
// constants
import DigitalPackshot from 'components/packshots/digital-packshot';
import DigitalPackshotHero from 'components/packshots/digital-packshot-hero';
import GuardianWeeklyPackShot from 'components/packshots/guardian-weekly-packshot';
import GuardianWeeklyPackShotHero from 'components/packshots/guardian-weekly-packshot-hero';
import PaperPackshot from 'components/packshots/paper-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
// images
import PrintFeaturePackshot from 'components/packshots/print-feature-packshot';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	EURCountries,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import {
	currencies,
	detect,
	fromCountryGroupId,
	glyph,
} from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	Monthly,
	postIntroductorySixForSixBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import {
	DigitalPack,
	fixDecimals,
	GuardianWeekly,
	Paper,
	sendTrackingEventsOnClick,
} from 'helpers/productPrice/subscriptions';
import trackAppStoreLink from 'helpers/tracking/appCtaTracking';
import type { Option } from 'helpers/types/option';
import { androidAppUrl, getIosAppUrl } from 'helpers/urls/externalLinks';
import {
	digitalSubscriptionLanding,
	guardianWeeklyLanding,
	paperSubsUrl,
} from 'helpers/urls/routes';
import type { PriceCopy, PricingCopy } from '../subscriptionsLandingProps';
// types
export type ProductButton = {
	ctaButtonText: string;
	link: string;
	analyticsTracking: (...args: any[]) => any;
	hierarchy?: string;
};
export type ProductCopy = {
	title: string;
	subtitle: Option<string>;
	description: string;
	productImage: React.ReactNode;
	offer?: string;
	buttons: ProductButton[];
	classModifier?: string[];
};
const abTest = null;

// const getPrice = (countryGroupId: CountryGroupId, product: SubscriptionProduct) => {
//
//   if (flashSaleIsActive(product, countryGroupId)) {
//     return getDisplayFlashSalePrice(product, countryGroupId, Monthly);
//   }
//
//   if (subscriptionPricesForDefaultBillingPeriod[product][countryGroupId]) {
//     return `${displayPrice(product, countryGroupId)}`;
//   }
//
//   return '';
// };
const getDisplayPrice = (
	countryGroupId: CountryGroupId,
	price: number,
	billingPeriod: BillingPeriod = Monthly,
): string => {
	const currency = currencies[detect(countryGroupId)].glyph;
	return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

function getGuardianWeeklyOfferCopy(
	countryGroupId: CountryGroupId,
	discountCopy: string,
) {
	if (discountCopy !== '') {
		return discountCopy;
	}

	const currency = glyph(fromCountryGroupId(countryGroupId) || 'GBP');
	return `6 issues for ${currency}6`;
}

const getDigitalImage = (isTop: boolean, countryGroupId: CountryGroupId) => {
	if (isTop) {
		return <DigitalPackshotHero countryGroupId={countryGroupId} />;
	}

	return <DigitalPackshot countryGroupId={countryGroupId} />;
};

const digital = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
	isTop: boolean,
): ProductCopy => ({
	title: 'Digital Subscription',
	subtitle: getDisplayPrice(countryGroupId, priceCopy.price),
	description:
		countryGroupId === AUDCountries
			? 'The Guardian Editions app including Australia Weekend, Premium access to the Guardian Live app and ad-free reading on theguardian.com'
			: 'The Guardian Editions app, Premium access to the Guardian Live app and ad-free reading on theguardian.com',
	productImage: getDigitalImage(isTop, countryGroupId),
	offer: priceCopy.discountCopy,
	buttons: [
		{
			ctaButtonText: 'Find out more',
			link: digitalSubscriptionLanding(countryGroupId, false),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'digipack_cta',
				product: 'DigitalPack',
				...(abTest && {
					abTest,
				}),
				componentType: 'ACQUISITIONS_BUTTON',
			}),
		},
		{
			ctaButtonText: 'See gift options',
			link: digitalSubscriptionLanding(countryGroupId, true),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'digipack_cta_gift',
				product: 'DigitalPack',
				...(abTest && {
					abTest,
				}),
				componentType: 'ACQUISITIONS_BUTTON',
			}),
			modifierClasses: '',
		},
	],
});

const getWeeklyImage = (isTop: boolean) => {
	if (isTop) {
		return <GuardianWeeklyPackShotHero />;
	}

	return <GuardianWeeklyPackShot />;
};

const guardianWeekly = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
	isTop: boolean,
): ProductCopy => ({
	title: 'The Guardian Weekly',
	subtitle: getDisplayPrice(
		countryGroupId,
		priceCopy.price,
		postIntroductorySixForSixBillingPeriod,
	),
	description:
		'A weekly, global magazine from the Guardian, with delivery worldwide',
	offer: getGuardianWeeklyOfferCopy(countryGroupId, priceCopy.discountCopy),
	buttons: [
		{
			ctaButtonText: 'Find out more',
			link: guardianWeeklyLanding(countryGroupId, false),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'weekly_cta',
				product: 'GuardianWeekly',
				...(abTest && {
					abTest,
				}),
				componentType: 'ACQUISITIONS_BUTTON',
			}),
		},
		{
			ctaButtonText: 'See gift options',
			link: guardianWeeklyLanding(countryGroupId, true),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'weekly_cta_gift',
				product: 'GuardianWeekly',
				...(abTest && {
					abTest,
				}),
				componentType: 'ACQUISITIONS_BUTTON',
			}),
			modifierClasses: '',
		},
	],
	productImage: getWeeklyImage(isTop),
});

const getPaperImage = (isTop: boolean) => {
	if (isTop) {
		return <PrintFeaturePackshot />;
	}

	return <PaperPackshot />;
};

const paper = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
	isTop: boolean,
): ProductCopy => ({
	title: 'Newspaper',
	subtitle: `from ${getDisplayPrice(countryGroupId, priceCopy.price)}`,
	description:
		"Save on the Guardian and the Observer's newspaper retail price all year round",
	buttons: [
		{
			ctaButtonText: 'Find out more',
			link: paperSubsUrl(false),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'paper_cta',
				product: Paper,
				...(abTest && {
					abTest,
				}),
				componentType: 'ACQUISITIONS_BUTTON',
			}),
		},
	],
	productImage: getPaperImage(isTop),
	offer: priceCopy.discountCopy,
});

// const paperAndDigital = (
//   countryGroupId: CountryGroupId,
//   referrerAcquisitionData: ReferrerAcquisitionData,
//   abParticipations: Participations,
// ): ProductCopy => {
//   const link = getLegacyPaperAndDigitalLink(
//     countryGroupId,
//     referrerAcquisitionData.campaignCode,
//     getCampaign(referrerAcquisitionData),
//     referrerAcquisitionData,
//     abParticipations,
//   );
//   return {
//     title: 'Paper+Digital',
//     subtitle: `from ${getPrice(countryGroupId, PaperAndDigital)}`,
//     description: 'All the benefits of a paper subscription, plus access to the digital subscription',
//     buttons: [{
//       ctaButtonText: 'Find out more',
//       link,
//       analyticsTracking: sendTrackingEventsOnClick({
//         id: 'paper_digital_cta',
//         product: PaperAndDigital,
//         ...(abTest && { abTest }),
//         componentType: 'ACQUISITIONS_BUTTON',
//       }),
//     }],
//     productImage: <PaperAndDigitalPackshot />,
//     offer: '',
//   };
// };
const premiumApp = (countryGroupId: CountryGroupId): ProductCopy => ({
	title: 'Premium access to the Guardian Live app',
	subtitle: '7-day free Trial',
	description: 'Ad-free live news, as it happens',
	buttons: [
		{
			ctaButtonText: 'Buy in App Store',
			link: getIosAppUrl(countryGroupId),
			analyticsTracking: trackAppStoreLink(
				'premium_tier_ios_cta',
				'PremiumTier',
				abTest,
			),
		},
		{
			ctaButtonText: 'Buy on Google Play',
			link: androidAppUrl,
			analyticsTracking: trackAppStoreLink(
				'premium_tier_android_cta',
				'PremiumTier',
				abTest,
			),
			hierarchy: 'first',
		},
	],
	productImage: <PremiumAppPackshot />,
	classModifier: ['subscriptions__premuim-app'],
});

const getSubscriptionCopy = (
	countryGroupId: CountryGroupId,
	pricingCopy: PricingCopy,
): ProductCopy[] => {
	if (countryGroupId === GBPCountries) {
		return [
			digital(countryGroupId, pricingCopy[DigitalPack], true),
			guardianWeekly(countryGroupId, pricingCopy[GuardianWeekly], false),
			paper(countryGroupId, pricingCopy[Paper], false), // Removing the link to the old paper+digital page during the June 21 Sale
			// paperAndDigital(countryGroupId, state.common.referrerAcquisitionData, state.common.abParticipations),
			premiumApp(countryGroupId),
		];
	} else if (countryGroupId === EURCountries) {
		return [
			guardianWeekly(countryGroupId, pricingCopy[GuardianWeekly], true),
			digital(countryGroupId, pricingCopy[DigitalPack], false),
			premiumApp(countryGroupId),
		];
	}

	return [
		digital(countryGroupId, pricingCopy[DigitalPack], true),
		guardianWeekly(countryGroupId, pricingCopy[GuardianWeekly], false),
		premiumApp(countryGroupId),
	];
};

export { getSubscriptionCopy };
