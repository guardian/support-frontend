import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { ReactNode } from 'react';
import type { Product } from 'components/product/productOption';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import {
	getDiscountVsRetail,
	getProductPrice,
	showPrice,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	discountSummaryCopy,
	finalPrice,
	getAppliedPromo,
} from 'helpers/productPrice/promotions';
import type { TrackingProperties } from 'helpers/productPrice/subscriptions';
import {
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import { paperCheckoutUrl } from 'helpers/urls/routes';
import type { ActivePaperProductOptions } from '../../../helpers/productCatalogToProductOption';
import getPlanData from '../planData';
import type { PaperPromotion } from './getPromotions';
import { getProductLabel, getTitle } from './products';

const getPriceCopyString = (
	price: ProductPrice,
	productCopy: ReactNode = null,
): ReactNode => {
	const promotion = getAppliedPromo(price.promotions);

	if (promotion?.numberOfDiscountedPeriods) {
		return (
			<>
				per month for {promotion.numberOfDiscountedPeriods} months{productCopy},
				then {showPrice(price)} after
			</>
		);
	}

	return <>per month{productCopy}</>;
};

// Show promo summary if there's a promo, otherwise show savings vs retail if any
const getOfferText = (
	price: ProductPrice,
	promo?: Promotion,
	promotionIndex?: number,
) => {
	if (promo?.discount?.amount && promotionIndex !== undefined) {
		return discountSummaryCopy(
			getCurrencyInfo(price.currency),
			promotionIndex + 1, // if promotionIndex is 0, we want to show one "*"
			price.price,
			promo,
			BillingPeriod.Monthly,
		);
	}

	return '';
};

const getSavingsText = (
	price: ProductPrice,
	promo?: Promotion,
): string | null => {
	if (promo?.discount?.amount) {
		const discount = getDiscountVsRetail(
			price.price,
			price.savingVsRetail ?? 0,
			promo.discount.amount,
		);

		if (discount > 0) {
			return `Save ${discount}% on retail price`;
		}

		return null;
	}

	if (price.savingVsRetail && price.savingVsRetail > 0) {
		return `Save ${Math.floor(price.savingVsRetail)}% on retail price`;
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

export const getPlans = (
	fulfilmentOption: PaperFulfilmentOptions,
	productPrices: ProductPrices,
	activePaperProductTypes: ActivePaperProductOptions[],
	promotions: PaperPromotion[],
): Product[] =>
	activePaperProductTypes
		.filter(
			(productOption) =>
				productOption.endsWith('Plus') || productOption === 'Sunday',
		)
		.map((productOption) => {
			const priceAfterPromosApplied = finalPrice(
				productPrices,
				'GB',
				BillingPeriod.Monthly,
				fulfilmentOption,
				productOption,
			);

			const promotion = getAppliedPromo(priceAfterPromosApplied.promotions);

			const promotionIndex = promotions.findIndex((promo) =>
				promo.activePaperProducts.includes(productOption),
			);

			const promoCode = promotion ? promotion.promoCode : null;
			const trackingProperties: TrackingProperties = {
				id: `subscribe_now_cta-${[productOption, fulfilmentOption].join()}`,
				product: 'Paper',
				componentType: 'ACQUISITIONS_BUTTON',
			};
			const nonDiscountedPrice = getProductPrice(
				productPrices,
				'GB',
				BillingPeriod.Monthly,
				fulfilmentOption,
				productOption,
			);
			const showLabel = productOption === 'SixdayPlus';
			const productLabel = getProductLabel(productOption);
			const savingsText =
				productOption !== 'Sunday'
					? getSavingsText(nonDiscountedPrice, promotion)
					: null;

			return {
				title: getTitle(productOption),
				price: showPrice(priceAfterPromosApplied),
				href: paperCheckoutUrl(fulfilmentOption, productOption, promoCode),
				onClick: sendTrackingEventsOnClick(trackingProperties),
				onView: sendTrackingEventsOnView(trackingProperties),
				buttonCopy: 'Subscribe',
				priceCopy: getPriceCopyString(
					nonDiscountedPrice,
					copy[fulfilmentOption][productOption],
				),
				planData: getPlanData(productOption, fulfilmentOption),
				offerCopy: getOfferText(nonDiscountedPrice, promotion, promotionIndex),
				savingsText,
				showLabel,
				productLabel,
				unavailableOutsideLondon: getUnavailableOutsideLondon(
					fulfilmentOption,
					productOption,
				),
			};
		});
