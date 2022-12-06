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
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	EURCountries,
	GBPCountries,
	NZDCountries,
} from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Monthly } from 'helpers/productPrice/billingPeriods';
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
	analyticsTracking: () => void;
	hierarchy?: string;
	modifierClasses?: string;
};

export type ProductCopy = {
	title: string;
	subtitle: Option<string>;
	description: string;
	productImage: React.ReactNode;
	offer?: string;
	buttons: ProductButton[];
	classModifier?: string[];
	participations?: Participations;
};

const getDisplayPrice = (
	countryGroupId: CountryGroupId,
	price: number,
	billingPeriod: BillingPeriod = Monthly,
): string => {
	const currency = currencies[detect(countryGroupId)].glyph;
	return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

/**
 * Temporary solution promoting Guardian Weekly Gifting Christmas
 * offer in the Guardian Weekly section of subs landing page
 * between 01/12/2022 and 23/12/2022GW
 */
const getDisplayPriceGWGiftingChristmas = (
	countryGroupId: CountryGroupId,
): string => {
	const currency = currencies[detect(countryGroupId)].glyph;
	const prices = {
		GBPCountries: 82.5,
		UnitedStates: 165,
		AUDCountries: 216,
		EURCountries: 141,
		NZDCountries: 273,
		Canada: 180,
		International: 180,
	};
	return `${currency}${fixDecimals(prices[countryGroupId])}/Annual`;
};

function getGuardianWeeklyOfferCopy(discountCopy: string) {
	/**
	 * Temporary solution promoting Guardian Weekly Gifting Christmas
	 * offer in the Guardian Weekly section of subs landing page
	 * between 01/12/2022 and 23/12/2022
	 */
	return '50% off annual gifting subscription';
	if (discountCopy !== '') {
		return discountCopy;
	}

	return '';
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
				componentType: 'ACQUISITIONS_BUTTON',
			}),
		},
		{
			ctaButtonText: 'See gift options',
			link: digitalSubscriptionLanding(countryGroupId, true),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'digipack_cta_gift',
				product: 'DigitalPack',
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
	participations: Participations,
): ProductCopy => ({
	title: 'Guardian Weekly',
	subtitle: getDisplayPriceGWGiftingChristmas(countryGroupId),
	description:
		'Give someone answers and insights that go beyond the headlines, and into the issues that matter most. They can enjoy handpicked articles from the Guardian and Observer, curated into one magazine and delivered for free, wherever they are in the world. Plus, for a limited time, gift a whole year’s subscription, for half the usual price.',
	offer: getGuardianWeeklyOfferCopy(priceCopy.discountCopy),
	buttons: [
		{
			ctaButtonText: 'See gift options',
			link: guardianWeeklyLanding(countryGroupId, true),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'weekly_cta_gift',
				product: 'GuardianWeekly',
				componentType: 'ACQUISITIONS_BUTTON',
			}),
			modifierClasses: 'guardian-weekly',
		},
		{
			ctaButtonText: 'See personal subscriptions',
			link: guardianWeeklyLanding(countryGroupId, false),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'weekly_cta',
				product: 'GuardianWeekly',
				componentType: 'ACQUISITIONS_BUTTON',
			}),
			modifierClasses: 'guardian-weekly',
		},
	],
	productImage: getWeeklyImage(isTop),
	participations: participations,
	classModifier: ['subscriptions__guardian-weekly'],
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
				componentType: 'ACQUISITIONS_BUTTON',
			}),
		},
	],
	productImage: getPaperImage(isTop),
	offer: priceCopy.discountCopy,
});

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
			),
		},
		{
			ctaButtonText: 'Buy on Google Play',
			link: androidAppUrl,
			analyticsTracking: trackAppStoreLink(
				'premium_tier_android_cta',
				'PremiumTier',
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
	participations: Participations,
	hideDigiSub?: boolean,
): ProductCopy[] => {
	const isRegionWeeklyFirst = [
		GBPCountries,
		EURCountries,
		AUDCountries,
		NZDCountries,
	].includes(countryGroupId)
		? true
		: false;
	const productcopy: ProductCopy[] = [
		guardianWeekly(
			countryGroupId,
			pricingCopy[GuardianWeekly],
			isRegionWeeklyFirst,
			participations,
		),
	];
	if (!hideDigiSub) {
		if (isRegionWeeklyFirst) {
			productcopy.push(
				digital(countryGroupId, pricingCopy[DigitalPack], false),
			);
		} else {
			productcopy.unshift(
				digital(countryGroupId, pricingCopy[DigitalPack], false),
			);
		}
	}
	if (countryGroupId === GBPCountries) {
		productcopy.push(paper(countryGroupId, pricingCopy[Paper], false));
	}
	if (!hideDigiSub) {
		productcopy.push(premiumApp(countryGroupId));
	}
	return productcopy;
};

export { getSubscriptionCopy };
