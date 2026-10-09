import { getCurrencyByCode } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { ReactNode } from 'react';
import type { Product } from 'components/product/productOption';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import { ActivePaperProductTypes } from 'helpers/productCatalogToProductOption';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import { getDiscountedPrice } from 'helpers/productPrice/discountedPrice';
import { getDiscountVsRetail } from 'helpers/productPrice/productPrices';
import type { TrackingProperties } from 'helpers/productPrice/subscriptions';
import {
	fixDecimals,
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import { paperCheckoutUrl } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import getPlanData from '../planData';
import { getProductLabel, getTitle } from './products';

// The landing page only has Collection and HomeDelivery tabs. NationalDelivery
// is chosen at checkout based on postcode, so it is not shown here.
const getLandingPageProductKey = (
	fulfilmentOption: PaperFulfilmentOptions,
): 'SubscriptionCard' | 'HomeDelivery' =>
	fulfilmentOption === 'Collection' ? 'SubscriptionCard' : 'HomeDelivery';

const showPrice = (price: number): string =>
	`${extendedGlyph('GBP')}${fixDecimals(price)}`;

const formatAmount = (amount: number): string =>
	simpleFormatAmount(getCurrencyByCode('GBP'), amount);

const getPriceCopyString = (
	price: number,
	promotion?: PromoWithCatalogInformation,
	productCopy: ReactNode = null,
): ReactNode => {
	const durationMonths = promotion?.discount?.durationMonths;

	if (durationMonths) {
		return (
			<>
				per month for {durationMonths} months{productCopy}, then{' '}
				{showPrice(price)} after
			</>
		);
	}

	return <>per month{productCopy}</>;
};

const getOfferText = (
	price: number,
	discountedPrice: number,
	durationMonths: number,
	showAsterisk: boolean,
): string => {
	const duration =
		durationMonths === 1 ? 'the first month' : `${durationMonths} months`;
	return `${formatAmount(
		discountedPrice,
	)}/month for ${duration}, then ${formatAmount(price)}/month${
		showAsterisk ? '*' : ''
	}`;
};

const getSavingsText = (
	price: number,
	savingVsRetail: number | null | undefined,
	promotion?: PromoWithCatalogInformation,
): string | null => {
	if (promotion?.discount?.amount) {
		const discount = getDiscountVsRetail(
			price,
			savingVsRetail ?? 0,
			promotion.discount.amount,
		);

		if (discount > 0) {
			return `Save ${discount}% on retail price`;
		}

		return null;
	}

	if (savingVsRetail && savingVsRetail > 0) {
		return `Save ${Math.floor(savingVsRetail)}% on retail price`;
	}

	return null;
};

const getUnavailableOutsideLondon = (
	fulfilmentOption: PaperFulfilmentOptions,
	productOption: PaperProductOptions,
) =>
	fulfilmentOption === 'HomeDelivery' &&
	(productOption === 'Saturday' ||
		productOption === 'Sunday' ||
		productOption === 'SaturdayPlus');

// ---- Plans ----- //
const copy: Record<
	PaperFulfilmentOptions,
	Record<PaperProductOptions, JSX.Element>
> = {
	HomeDelivery: {
		Everyday: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>,
				delivered
			</>
		),
		Sixday: (
			<>
				{' '}
				for <strong>the Guardian</strong>, delivered
			</>
		),
		Weekend: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>,
				delivered
			</>
		),
		Saturday: (
			<>
				{' '}
				for <strong>the Guardian</strong>, delivered
			</>
		),
		Sunday: (
			<>
				{' '}
				for <strong>the Observer</strong>, delivered
			</>
		),
		EverydayPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>,
				delivered
			</>
		),
		SixdayPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong>, delivered
			</>
		),
		WeekendPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>,
				delivered
			</>
		),
		SaturdayPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong>, delivered
			</>
		),
	},
	Collection: {
		Everyday: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>
			</>
		),
		Sixday: (
			<>
				{' '}
				for <strong>the Guardian</strong>
			</>
		),
		Weekend: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>
			</>
		),
		Saturday: (
			<>
				{' '}
				for <strong>the Guardian</strong>
			</>
		),
		Sunday: (
			<>
				{' '}
				for <strong>the Observer</strong>
			</>
		),
		EverydayPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>
			</>
		),
		SixdayPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong>
			</>
		),
		WeekendPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>
			</>
		),
		SaturdayPlus: (
			<>
				{' '}
				for <strong>the Guardian</strong>
			</>
		),
	},
};

export const getPlans = ({
	fulfilmentOption,
	productCatalog,
	promotions,
	promoCode,
}: {
	fulfilmentOption: PaperFulfilmentOptions;
	productCatalog: WindowProductCatalog;
	promotions: PromoWithCatalogInformation[];
	promoCode?: string;
}): Product[] => {
	const productKey = getLandingPageProductKey(fulfilmentOption);

	const ratePlansWithPrices = ActivePaperProductTypes.filter(
		(productOption) =>
			productOption.endsWith('Plus') || productOption === 'Sunday',
	).flatMap((productOption) => {
		const ratePlan = productCatalog[productKey]?.ratePlans[productOption];
		const price = ratePlan?.pricing.GBP;
		if (!ratePlan || price === undefined) {
			logException(`No price found for ${productKey} ${productOption}`);
			return [];
		}
		return [{ productOption, ratePlan, price }];
	});

	return ratePlansWithPrices.map(({ productOption, ratePlan, price }) => {
		const promotion = getAppliedPromotion(
			promotions,
			productKey,
			productOption,
			promoCode,
		);
		const discountedPrice = promotion?.discount
			? getDiscountedPrice(price, promotion.discount, BillingPeriod.Monthly)
			: undefined;
		// The asterisk refers to the promo terms, which NewspaperRatePlanCard only
		// shows for the Guardian (Plus) products, not the Observer (Sunday)
		const showAsterisk = productOption.endsWith('Plus');

		const trackingProperties: TrackingProperties = {
			id: `subscribe_now_cta-${[productOption, fulfilmentOption].join()}`,
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		};
		const showLabel = productOption === 'SixdayPlus';

		return {
			title: getTitle(productOption),
			price: showPrice(discountedPrice ?? price),
			href: paperCheckoutUrl(
				fulfilmentOption,
				productOption,
				promotion?.promoCode ?? null,
			),
			onClick: sendTrackingEventsOnClick(trackingProperties),
			onView: sendTrackingEventsOnView(trackingProperties),
			buttonCopy: 'Subscribe',
			priceCopy: getPriceCopyString(
				price,
				promotion,
				copy[fulfilmentOption][productOption],
			),
			planData: getPlanData(productOption, fulfilmentOption),
			offerCopy:
				promotion?.discount?.amount && discountedPrice !== undefined
					? getOfferText(
							price,
							discountedPrice,
							promotion.discount.durationMonths,
							showAsterisk,
					  )
					: '',
			savingsText: getSavingsText(price, ratePlan.savingVsRetail, promotion),
			showLabel,
			productLabel: getProductLabel(productOption),
			promotion,
			unavailableOutsideLondon: getUnavailableOutsideLondon(
				fulfilmentOption,
				productOption,
			),
		};
	});
};
