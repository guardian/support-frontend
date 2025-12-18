import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type * as React from 'react';
import DigitalPlusPackshot from 'components/packshots/digital-plus-packshot';
import PaperPackShot from 'components/packshots/paperPackshot';
import WeeklyPackShot from 'components/packshots/weeklyPackshot';
import type { Participations } from 'helpers/abTests/models';
import { detect, glyph } from 'helpers/internationalisation/currency';
import type { ProductBenefit } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import {
	DigitalPack,
	fixDecimals,
	GuardianWeekly,
	Paper,
	sendTrackingEventsOnClick,
} from 'helpers/productPrice/subscriptions';
import {
	digitalSubscriptionLanding,
	guardianWeeklyLanding,
	paperSubsUrl,
} from 'helpers/urls/routes';
import type { PriceCopy, PricingCopy } from '../subscriptionsLandingProps';
import { weeklySubscriptionProductCardStyle } from './subscriptionCopyStyles';

// types
export type ProductButton = {
	ctaButtonText: string;
	link: string;
	analyticsTracking: () => void;
	hierarchy?: string;
	modifierClasses?: string;
	primary?: boolean;
	ariaLabel?: string;
};

export type ProductCopy = {
	title: string;
	subtitle: string;
	description: string;
	productImage: React.ReactNode;
	buttons: ProductButton[];
	cssOverrides?: SerializedStyles;
	offer?: string;
	participations?: Participations;
	benefits?: ProductBenefit[];
	digitalPlusLayout?: boolean;
};

const getDisplayPrice = (
	countryGroupId: CountryGroupId,
	price: number,
	billingPeriod = BillingPeriod.Monthly,
): string => {
	const currency = glyph(detect(countryGroupId));
	return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

const getDigitalPlusDisplayPrice = (
	countryGroupId: CountryGroupId,
	billingPeriod: BillingPeriod,
): string => {
	const currencyKey = detect(countryGroupId);
	const product = productCatalog['DigitalSubscription'];
	const price = product?.ratePlans[billingPeriod]?.pricing[currencyKey];
	if (!price) {
		return '';
	}

	return getDisplayPrice(countryGroupId, price, billingPeriod);
};

const getDigitalPlusPrices = (countryGroupId: CountryGroupId): string => {
	const priceMonthly = getDigitalPlusDisplayPrice(
		countryGroupId,
		BillingPeriod.Monthly,
	);
	const priceAnnual = getDigitalPlusDisplayPrice(
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

function buildDigialPlusBenefits(): ProductBenefit[] {
	const benefits = [
		'<strong>The Guardian Editions app</strong> including Guardian newspaper, Guardian Weekly and the Long Read on your mobile and tablet',
		'Unlimited access to the <strong>Guardian app</strong> and <strong>Guardian Feast app</strong>',
		'Digital access to the Guardian’s 200 year <strong>newspaper archive</strong>',
		'<strong>Ad-free reading</strong> on all your devices',
	];
	return benefits.map((benefit) => ({ copy: benefit }));
}

function digitalPlus(
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy {
	return {
		title: 'Enjoy our suite of editions with&nbsp;<mark>Digital Plus</mark>',
		subtitle: getDigitalPlusPrices(countryGroupId),
		description: 'Enjoy our suite of editions with Digital Plus',
		buttons: [
			{
				ctaButtonText: getDigitalPlusDisplayPrice(
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
				ariaLabel: `${BillingPeriod.Monthly} DigitalEdition`,
			},
			{
				ctaButtonText: getDigitalPlusDisplayPrice(
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
				ariaLabel: `${BillingPeriod.Annual} DigitalEdition`,
			},
		],
		benefits: buildDigialPlusBenefits(),
		productImage: <DigitalPlusPackshot />,
		offer: priceCopy.discountCopy,
		digitalPlusLayout: true,
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
	productImage: <WeeklyPackShot />,
	participations: participations,
	cssOverrides: weeklySubscriptionProductCardStyle,
});

const paper = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy => {
	return {
		title: 'Newspaper',
		subtitle: `from ${getDisplayPrice(countryGroupId, priceCopy.price)}`,
		description:
			'Save on the Guardian newspaper retail price and enjoy full digital access',
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
		productImage: <PaperPackShot />,
		offer: priceCopy.discountCopy,
		cssOverrides: css``,
	};
};

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
	productcopy.push(digitalPlus(countryGroupId, pricingCopy[DigitalPack]));
	return productcopy;
};

export { getSubscriptionCopy };
