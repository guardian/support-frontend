import type { SerializedStyles } from '@emotion/utils';
import type {
	ButtonPriority,
	ThemeButton,
} from '@guardian/source/react-components';
import { themeButtonReaderRevenueBrand } from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type * as React from 'react';
import { themeButtonLegacyGray } from 'components/button/theme';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';
import DigitalPlusPackshot from 'components/packshots/digitalPlusPackshot';
import PaperPackShot from 'components/packshots/paperPackshot';
import PaperPackShots from 'components/packshots/paperPackshots';
import WeeklyPackShot from 'components/packshots/weeklyPackshot';
import WeeklyPackShots from 'components/packshots/weeklyPackShots';
import type { Participations } from 'helpers/abTests/models';
import { detect, glyph } from 'helpers/internationalisation/currency';
import type { ProductBenefit } from 'helpers/productCatalog';
import { getProductCatalog } from 'helpers/productCatalog';
import {
	DigitalPack,
	fixDecimals,
	GuardianWeekly,
	Paper,
	sendTrackingEventsOnClick,
} from 'helpers/productPrice/subscriptions';
import {
	getDigitalPlusCheckoutDeepLink,
	guardianWeeklyLanding,
	paperSubsUrl,
} from 'helpers/urls/routes';
import type { PriceCopy, PricingCopy } from '../subscriptionsLandingProps';
import {
	paperSubscriptionProductCardStyle,
	weeklySubscriptionProductCardStyle,
} from './subscriptionCopyStyles';

// types
export type ProductButton = {
	ctaButtonText: string;
	link: string;
	analyticsTracking: () => void;
	hierarchy?: string;
	priority?: ButtonPriority;
	theme?: Partial<ThemeButton>;
	ariaLabel?: string;
};

export type ProductCopy = {
	title: string;
	subtitle: string;
	description: string;
	productImage: React.ReactNode;
	packshotImage?: React.ReactElement<GridPictureProp>;
	buttons: ProductButton[];
	cssOverrides?: SerializedStyles;
	offer?: string;
	participations?: Participations;
	benefits?: ProductBenefit[];
	digitalPlusLayout?: boolean;
	enableDigitalWeekly?: boolean;
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
): string | null => {
	const currencyKey = detect(countryGroupId);

	const product = getProductCatalog()['DigitalSubscription'];
	const price = product?.ratePlans[billingPeriod]?.pricing[currencyKey];
	if (!price) {
		return null;
	}

	return getDisplayPrice(countryGroupId, price, billingPeriod);
};

const getWeeklyDigitalDisplayPrice = (
	countryGroupId: CountryGroupId,
	billingPeriod: BillingPeriod,
): string => {
	const currencyKey = detect(countryGroupId);
	const ratePlan = `${billingPeriod}Plus`;

	const product = getProductCatalog()['GuardianWeeklyDomestic'];
	const price = product?.ratePlans[ratePlan]?.pricing[currencyKey];
	if (!price) {
		return '';
	}

	return getDisplayPrice(countryGroupId, price, billingPeriod);
};

function buildDigialPlusBenefits(): ProductBenefit[] {
	const benefits = [
		'<strong>The Guardian Editions app</strong> including Guardian newspaper, Guardian Weekly and the Long Read on your mobile and tablet',
		'Unlimited access to the <strong>Guardian app</strong> and <strong>Guardian Feast app</strong>',
		'Digital access to the Guardian’s 200 year <strong>newspaper archive</strong>',
		'<strong>Ad-free reading</strong> on all your devices',
	];
	return benefits.map((benefit) => ({ copy: benefit }));
}

function getDigitalPlusButtonsForBillingPeriods(
	countryGroupId: CountryGroupId,
	billingPeriods: BillingPeriod[],
): ProductButton[] {
	return billingPeriods.reduce<ProductButton[]>((buttons, billingPeriod) => {
		const price = getDigitalPlusDisplayPrice(countryGroupId, billingPeriod);
		if (price) {
			buttons.push({
				ctaButtonText: price,
				link: getDigitalPlusCheckoutDeepLink(countryGroupId, billingPeriod),
				analyticsTracking: sendTrackingEventsOnClick({
					id: `digital_plus_${billingPeriod.toLowerCase()}_cta`,
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				}),
				ariaLabel: `${billingPeriod} DigitalPlus`,
				priority:
					billingPeriod === BillingPeriod.Monthly ? 'primary' : 'tertiary',
				theme: themeButtonReaderRevenueBrand,
			});
		}
		return buttons;
	}, []);
}

function getDigitalPlusSubtitleForBillingPeriods(
	countryGroupId: CountryGroupId,
	billingPeriods: BillingPeriod[],
): string {
	const prices = billingPeriods
		.map((billingPeriod) =>
			getDigitalPlusDisplayPrice(countryGroupId, billingPeriod),
		)
		.filter(Boolean);

	return prices.join(' or ');
}

function digitalPlus(
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
): ProductCopy {
	return {
		title: 'Enjoy our suite of editions with&nbsp;<mark>Digital Plus</mark>',
		subtitle: getDigitalPlusSubtitleForBillingPeriods(countryGroupId, [
			BillingPeriod.Monthly,
			BillingPeriod.Annual,
		]),
		description: 'Enjoy our suite of editions with Digital Plus',
		buttons: getDigitalPlusButtonsForBillingPeriods(countryGroupId, [
			BillingPeriod.Monthly,
			BillingPeriod.Annual,
		]),
		benefits: buildDigialPlusBenefits(),
		productImage: <DigitalPlusPackshot />,
		offer: priceCopy.discountCopy,
		digitalPlusLayout: true,
	};
}

function guardianWeekly(
	countryGroupId: CountryGroupId,
	priceCopy: PriceCopy,
	participations: Participations,
): ProductCopy {
	const weeklyFindButton = {
		ctaButtonText: 'Find out more',
		link: guardianWeeklyLanding(countryGroupId, false),
		analyticsTracking: sendTrackingEventsOnClick({
			id: 'weekly_cta',
			product: 'GuardianWeekly',
			componentType: 'ACQUISITIONS_BUTTON',
		}),
		priority: 'primary',
		theme: themeButtonLegacyGray,
	} as ProductButton;

	return {
		title: 'The Guardian Weekly',
		subtitle: getWeeklyDigitalDisplayPrice(
			countryGroupId,
			BillingPeriod.Monthly,
		),
		description:
			'A curated weekly news magazine featuring our best global journalism in print, delivered wherever you are in the world. Plus, enjoy unlimited access to our full suite of digital benefits for the complete Guardian experience.',
		offer: priceCopy.discountCopy || '',
		buttons: [weeklyFindButton],
		productImage: <WeeklyPackShot />,
		packshotImage: <WeeklyPackShots />,
		participations: participations,
		cssOverrides: weeklySubscriptionProductCardStyle,
	};
}

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
				priority: 'primary',
				theme: themeButtonLegacyGray,
			},
		],
		productImage: <PaperPackShot />,
		packshotImage: <PaperPackShots />,
		offer: priceCopy.discountCopy,
		cssOverrides: paperSubscriptionProductCardStyle,
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
