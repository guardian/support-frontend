import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import type {
	ButtonPriority,
	ThemeButton,
} from '@guardian/source/react-components';
import { themeButtonReaderRevenueBrand } from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type * as React from 'react';
import { themeButtonLegacyGray } from 'components/button/theme';
import DigitalPlusPackshot from 'components/packshots/digitalPlusPackshot';
import PaperPackShot from 'components/packshots/paperPackshot';
import { WeeklySubscriptionPackShot } from 'components/packshots/weeklyPackshots';
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
	supportRegionId: SupportRegionId,
	price: number,
	billingPeriod = BillingPeriod.Monthly,
): string => {
	const currency = glyph(detect(supportRegionId));
	return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

const getDigitalPlusDisplayPrice = (
	supportRegionId: SupportRegionId,
	billingPeriod: BillingPeriod,
): string | null => {
	const currencyKey = detect(supportRegionId);

	const product = getProductCatalog()['DigitalSubscription'];
	const price = product?.ratePlans[billingPeriod]?.pricing[currencyKey];
	if (!price) {
		return null;
	}

	return getDisplayPrice(supportRegionId, price, billingPeriod);
};

const getWeeklyDigitalDisplayPrice = (
	supportRegionId: SupportRegionId,
	billingPeriod: BillingPeriod,
): string => {
	const currencyKey = detect(supportRegionId);
	const ratePlan = `${billingPeriod}Plus`;

	const product = getProductCatalog()['GuardianWeeklyDomestic'];
	const price = product?.ratePlans[ratePlan]?.pricing[currencyKey];
	if (!price) {
		return '';
	}

	return getDisplayPrice(supportRegionId, price, billingPeriod);
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
	supportRegionId: SupportRegionId,
	billingPeriods: BillingPeriod[],
): ProductButton[] {
	return billingPeriods.reduce<ProductButton[]>((buttons, billingPeriod) => {
		const price = getDigitalPlusDisplayPrice(supportRegionId, billingPeriod);
		if (price) {
			buttons.push({
				ctaButtonText: price,
				link: getDigitalPlusCheckoutDeepLink(supportRegionId, billingPeriod),
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
	supportRegionId: SupportRegionId,
	billingPeriods: BillingPeriod[],
): string {
	const prices = billingPeriods
		.map((billingPeriod) =>
			getDigitalPlusDisplayPrice(supportRegionId, billingPeriod),
		)
		.filter(Boolean);

	return prices.join(' or ');
}

function digitalPlus(
	supportRegionId: SupportRegionId,
	priceCopy: PriceCopy,
): ProductCopy {
	return {
		title: 'Enjoy our suite of editions with&nbsp;<mark>Digital Plus</mark>',
		subtitle: getDigitalPlusSubtitleForBillingPeriods(supportRegionId, [
			BillingPeriod.Monthly,
			BillingPeriod.Annual,
		]),
		description: 'Enjoy our suite of editions with Digital Plus',
		buttons: getDigitalPlusButtonsForBillingPeriods(supportRegionId, [
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
	supportRegionId: SupportRegionId,
	priceCopy: PriceCopy,
	participations: Participations,
): ProductCopy {
	const weeklyFindButton = {
		ctaButtonText: 'Find out more',
		link: guardianWeeklyLanding(supportRegionId, false),
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
			supportRegionId,
			BillingPeriod.Monthly,
		),
		description:
			'A curated weekly news magazine featuring our best global journalism in print, delivered wherever you are in the world. Plus, enjoy unlimited access to our full suite of digital benefits for the complete Guardian experience.',
		offer: priceCopy.discountCopy || '',
		buttons: [weeklyFindButton],
		productImage: <WeeklySubscriptionPackShot />,
		participations: participations,
		cssOverrides: weeklySubscriptionProductCardStyle,
	};
}

const paper = (
	supportRegionId: SupportRegionId,
	priceCopy: PriceCopy,
): ProductCopy => {
	return {
		title: 'Newspaper',
		subtitle: `from ${getDisplayPrice(supportRegionId, priceCopy.price)}`,
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
		offer: priceCopy.discountCopy,
		cssOverrides: css``,
	};
};

export const getSubscriptionProducts = (
	supportRegionId: SupportRegionId,
	pricingCopy: PricingCopy,
	participations: Participations,
): ProductCopy[] => {
	const productcopy: ProductCopy[] = [
		guardianWeekly(supportRegionId, pricingCopy[GuardianWeekly], participations),
	];
	if (supportRegionId === 'uk') {
		productcopy.push(paper(supportRegionId, pricingCopy[Paper]));
	}
	productcopy.push(digitalPlus(supportRegionId, pricingCopy[DigitalPack]));
	return productcopy;
};
