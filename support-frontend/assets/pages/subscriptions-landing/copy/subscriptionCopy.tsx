import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import type {
	ButtonPriority,
	ThemeButton,
} from '@guardian/source/react-components';
import { themeButtonReaderRevenueBrand } from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
} from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type * as React from 'react';
import { themeButtonLegacyGray } from 'components/button/theme';
import DigitalPlusPackshot from 'components/packshots/digitalPlusPackshot';
import PaperPackShot from 'components/packshots/paperPackshot';
import { WeeklySubscriptionPackShot } from 'components/packshots/weeklyPackshots';
import type { Participations } from 'helpers/abTests/models';
import { detect, glyph } from 'helpers/internationalisation/currency';
import type { ProductBenefit } from 'helpers/productCatalog';
import {
	getProductCatalog,
	internationaliseProduct,
} from 'helpers/productCatalog';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import { getDiscountedPrice } from 'helpers/productPrice/discountedPrice';
import {
	fixDecimals,
	Paper,
	sendTrackingEventsOnClick,
} from 'helpers/productPrice/subscriptions';
import {
	getDigitalPlusCheckoutDeepLink,
	guardianWeeklyLanding,
	paperSubsUrl,
} from 'helpers/urls/routes';
import { weeklySubscriptionProductCardStyle } from './subscriptionCopyStyles';

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
	buttons: ProductButton[];
	cssOverrides?: SerializedStyles;
	imagePosition?: 'float' | 'bottom';
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
	promotions: PromoWithCatalogInformation[],
): ProductCopy {
	const offer = getAppliedPromotion(
		promotions,
		'DigitalSubscription',
		'Monthly',
	)?.description;

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
		offer: offer ?? '',
		digitalPlusLayout: true,
	};
}

function guardianWeekly(
	countryGroupId: CountryGroupId,
	promotions: PromoWithCatalogInformation[],
	participations: Participations,
): ProductCopy {
	const weeklyProductKey = internationaliseProduct(
		countryGroups[countryGroupId].supportRegionId,
		'GuardianWeeklyDomestic',
	);
	const offer = getAppliedPromotion(
		promotions,
		weeklyProductKey,
		'MonthlyPlus',
	)?.description;

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
		offer: offer ?? '',
		buttons: [weeklyFindButton],
		productImage: <WeeklySubscriptionPackShot />,
		participations: participations,
		cssOverrides: weeklySubscriptionProductCardStyle,
	};
}

const paper = (
	countryGroupId: CountryGroupId,
	promotions: PromoWithCatalogInformation[],
): ProductCopy => {
	const currencyKey = detect(countryGroupId);
	const cheapestPrice =
		getProductCatalog().SubscriptionCard?.ratePlans.SaturdayPlus?.pricing[
			currencyKey
		];
	const promotion = getAppliedPromotion(
		promotions,
		'SubscriptionCard',
		'SaturdayPlus',
	);
	const displayPrice =
		cheapestPrice !== undefined && promotion?.discount
			? getDiscountedPrice(
					cheapestPrice,
					promotion.discount,
					BillingPeriod.Monthly,
			  )
			: cheapestPrice;

	return {
		title: 'Newspaper',
		subtitle:
			displayPrice !== undefined
				? `from ${getDisplayPrice(countryGroupId, displayPrice)}`
				: '',
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
		imagePosition: 'bottom',
		offer: promotion?.description ?? '',
		cssOverrides: css``,
	};
};

export const getSubscriptionProducts = (
	countryGroupId: CountryGroupId,
	promotions: PromoWithCatalogInformation[],
	participations: Participations,
): ProductCopy[] => {
	const productcopy: ProductCopy[] = [
		guardianWeekly(countryGroupId, promotions, participations),
	];
	if (countryGroupId === GBPCountries) {
		productcopy.push(paper(countryGroupId, promotions));
	}
	productcopy.push(digitalPlus(countryGroupId, promotions));
	return productcopy;
};
