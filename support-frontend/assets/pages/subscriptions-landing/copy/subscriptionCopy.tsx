import * as React from 'react';
// constants
import DigitalPackshotHero from 'components/packshots/digital-packshot-hero';
import GuardianWeeklyPackShotHero from 'components/packshots/guardian-weekly-packshot-hero';
import PaperPackshot from 'components/packshots/paper-packshot';
// images
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { ProductBenefit } from 'helpers/productCatalog';
import {
	productCatalog,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';
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
	billingPeriod: BillingPeriod = Monthly,
): string => {
	const currency = currencies[detect(countryGroupId)].glyph;
	return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

/*
  Retrieve the digital edition prices from the product catalog
*/
const getDigitialEditionPrices = (
	countryGroupId: CountryGroupId,
	price: number,
): string => {
	const currencyKey = detect(countryGroupId);
	const currency = currencies[currencyKey].glyph;
	const product = productCatalog['DigitalSubscription'];
	if (
		product?.ratePlans[Monthly]?.pricing[currencyKey] &&
		product.ratePlans[Annual]?.pricing[currencyKey]
	) {
		const price = {
			Monthly: product.ratePlans[Monthly].pricing[currencyKey] ?? 0,
			Annual: product.ratePlans[Annual].pricing[currencyKey] ?? 0,
		};
		return `${currency}${fixDecimals(
			price.Monthly,
		)}/${Monthly} ${currency}${fixDecimals(price.Annual)}/${Annual}`;
	}
	return getDisplayPrice(countryGroupId, price);
};

function getGuardianWeeklyOfferCopy(discountCopy: string) {
	if (discountCopy !== '') {
		return discountCopy;
	}

	return '';
}

const digitalEdition = (
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy => ({
	title: 'The Guardian Digital Edition',
	subtitle: getDisplayPrice(countryGroupId, priceCopy.price),
	description:
		'Enjoy the Guardian and Observer newspaper, available for mobile and tablet',
	buttons: [
		{
			ctaButtonText: 'Find out more',
			link: digitalSubscriptionLanding(countryGroupId),
			analyticsTracking: sendTrackingEventsOnClick({
				id: 'digipack_cta',
				product: 'DigitalPack',
				componentType: 'ACQUISITIONS_BUTTON',
			}),
			modifierClasses: 'digital',
		},
	],
	productImage: <DigitalPackshotHero />,
	classModifier: ['subscriptions__digital'],
	offer: priceCopy.discountCopy,
});

function digitalCheckout(
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy {
	return {
		...digitalEdition(countryGroupId, priceCopy),
		subtitle: getDigitialEditionPrices(countryGroupId, priceCopy.price),
		buttons: [
			{
				ctaButtonText: 'Subscribe Monthly',
				link: digitalSubscriptionLanding(countryGroupId, 'Monthly'),
				analyticsTracking: sendTrackingEventsOnClick({
					id: 'digipack_monthly_cta',
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				}),
				modifierClasses: 'digital',
			},
			{
				ctaButtonText: 'Subscribe Annually',
				link: digitalSubscriptionLanding(countryGroupId, 'Annual'),
				analyticsTracking: sendTrackingEventsOnClick({
					id: 'digipack_annual_cta',
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				}),
				modifierClasses: 'digital',
				primary: true,
			},
		],
		benefits: productCatalogDescription['DigitalSubscription'].benefits,
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
		'Gain a deeper understanding of the issues that matter with the Guardian Weekly magazine. Every week, take your time over handpicked articles from the Guardian and Observer, delivered for free to wherever you are in the world.',
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
	const inDigitalEditionCheckout =
		participations.digitalEditionCheckout === 'variant';

	const productcopy: ProductCopy[] = [
		guardianWeekly(countryGroupId, pricingCopy[GuardianWeekly], participations),
	];
	if (countryGroupId === GBPCountries) {
		productcopy.push(paper(countryGroupId, pricingCopy[Paper]));
	}
	productcopy.push(
		inDigitalEditionCheckout
			? digitalCheckout(countryGroupId, pricingCopy[DigitalPack])
			: digitalEdition(countryGroupId, pricingCopy[DigitalPack]),
	);
	return productcopy;
};

export { getSubscriptionCopy };
