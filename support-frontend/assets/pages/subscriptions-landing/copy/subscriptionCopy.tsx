import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import * as React from 'react';
// constants
import DigitalPackshotHero from 'components/packshots/digital-packshot-hero';
import GuardianWeeklyPackShotHero from 'components/packshots/guardian-weekly-packshot-hero';
import PaperPackshot from 'components/packshots/paper-packshot';
// images
import type { Participations } from 'helpers/abTests/models';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { ProductBenefit } from 'helpers/productCatalog';
import {
	productCatalog,
	productCatalogDescription,
} from 'helpers/productCatalog';
import {
	DigitalPack,
	fixDecimals,
	GuardianWeekly,
	Paper,
	sendTrackingEventsOnClick,
} from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
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
	primary?: boolean;
};

type ProductCopy = {
	title: string;
	subtitle: Option<string>;
	description: string;
	productImage: React.ReactNode;
	offer?: string;
	buttons: ProductButton[];
	classModifier?: string[];
	participations?: Participations;
	benefits?: ProductBenefit[];
};

const getDisplayPrice = (
	countryGroupId: CountryGroupId,
	price: number,
	billingPeriod = BillingPeriod.Monthly,
): string => {
	const currency = currencies[detect(countryGroupId)].glyph;
	return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

const getDigitalEditionPrice = (
	countryGroupId: CountryGroupId,
	billingPeriod: BillingPeriod,
): string => {
	const currencyKey = detect(countryGroupId);
	const currency = currencies[currencyKey].glyph;
	const product = productCatalog['DigitalSubscription'];
	const price = product?.ratePlans[billingPeriod]?.pricing[currencyKey];
	if (!price) {
		return '';
	}
	const fixedPriceWtihCurrency = `${currency}${fixDecimals(price)}`;
	const billingFrequency =
		billingPeriod === BillingPeriod.Annual ? 'Annually' : billingPeriod;
	return `${fixedPriceWtihCurrency}/${billingFrequency}`;
};
const getDigitalEditionPrices = (countryGroupId: CountryGroupId): string => {
	const priceMonthly = getDigitalEditionPrice(
		countryGroupId,
		BillingPeriod.Monthly,
	);
	const priceAnnual = getDigitalEditionPrice(
		countryGroupId,
		BillingPeriod.Annual,
	);
	return [priceMonthly, priceAnnual].join(' or ');
};

function getGuardianWeeklyOfferCopy(discountCopy: string) {
	if (discountCopy !== '') {
		return discountCopy;
	}

	return '';
}

function digitalCheckout(
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy {
	return {
		title: 'The Guardian Digital Edition',
		subtitle: getDigitalEditionPrices(countryGroupId),
		description:
			'Enjoy the Guardian and Observer newspaper, available for mobile and tablet',
		buttons: [
			{
				ctaButtonText: getDigitalEditionPrice(
					countryGroupId,
					BillingPeriod.Monthly,
				),
				link: digitalSubscriptionLanding(countryGroupId, BillingPeriod.Monthly),
				analyticsTracking: sendTrackingEventsOnClick({
					id: 'digipack_monthly_cta',
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				}),
				modifierClasses: 'digital',
			},
			{
				ctaButtonText: getDigitalEditionPrice(
					countryGroupId,
					BillingPeriod.Annual,
				),
				link: digitalSubscriptionLanding(countryGroupId, BillingPeriod.Annual),
				analyticsTracking: sendTrackingEventsOnClick({
					id: 'digipack_annual_cta',
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				}),
				modifierClasses: 'digital',
			},
		],
		benefits: productCatalogDescription['DigitalSubscription'].benefits,
		productImage: <DigitalPackshotHero />,
		classModifier: ['subscriptions__digital'],
		offer: priceCopy.discountCopy,
	};
}

const guardianWeekly = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
	participations: Participations,
): ProductCopy => ({
	title: 'Guardian Weekly',
	subtitle: getDisplayPrice(countryGroupId, priceCopy.price),
	description:
		'Gain a deeper understanding of the issues that matter with the Guardian Weekly magazine. Every week, take your time over handpicked articles from the Guardian, delivered for free to wherever you are in the world.',
	offer: getGuardianWeeklyOfferCopy(priceCopy.discountCopy),
	buttons: [
		{
			ctaButtonText: 'Find out more',
			link: guardianWeeklyLanding(countryGroupId, false),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'weekly_cta',
				product: 'GuardianWeekly',
				componentType: 'ACQUISITIONS_BUTTON',
			}),
			modifierClasses: 'guardian-weekly',
		},
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
	],
	productImage: <GuardianWeeklyPackShotHero />,
	participations: participations,
	classModifier: ['subscriptions__guardian-weekly'],
});

const paper = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy => ({
	title: 'Newspaper',
	subtitle: `from ${getDisplayPrice(countryGroupId, priceCopy.price)}`,
	description:
		"Save on the Guardian and the Observer's newspaper retail price all year round",
	buttons: [
		{
			ctaButtonText: 'Find out more',
			link: paperSubsUrl(),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'paper_cta',
				product: Paper,
				componentType: 'ACQUISITIONS_BUTTON',
			}),
		},
	],
	productImage: <PaperPackshot />,
	offer: priceCopy.discountCopy,
});

const getSubscriptionCopy = (
	countryGroupId: CountryGroupId,
	pricingCopy: PricingCopy,
	participations: Participations,
): ProductCopy[] => {
	const productcopy: ProductCopy[] = [
		guardianWeekly(countryGroupId, pricingCopy[GuardianWeekly], participations),
	];
	if (countryGroupId === GBPCountries) {
		productcopy.push(paper(countryGroupId, pricingCopy[Paper]));
	}
	productcopy.push(digitalCheckout(countryGroupId, pricingCopy[DigitalPack]));
	return productcopy;
};

export { getSubscriptionCopy };
