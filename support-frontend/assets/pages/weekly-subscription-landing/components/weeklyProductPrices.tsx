import React from 'react';
import type { Product } from 'components/product/productOption';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { currencies } from 'helpers/internationalisation/currency';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { WeeklyBillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	billingPeriodTitle,
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
} from 'helpers/productPrice/billingPeriods';
import 'components/product/productOption';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { getSimplifiedPriceDescription } from 'helpers/productPrice/priceDescriptions';
import {
	getFirstValidPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	getAppliedPromo,
	promoQueryParam,
} from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	fixDecimals,
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import { getOrigin, getQueryParameter } from 'helpers/urls/url';
import type { OphanComponentType } from '../../../helpers/tracking/ophan';
import Prices from './content/prices';

const getCheckoutUrl = (
	billingPeriod: WeeklyBillingPeriod,
	orderIsGift: boolean,
): string => {
	const promoCode = getQueryParameter(promoQueryParam);
	const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
	const gift = orderIsGift ? '/gift' : '';
	return `${getOrigin()}/subscribe/weekly/checkout${gift}?period=${billingPeriod.toString()}${promoQuery}`;
};

const getCurrencySymbol = (currencyId: IsoCurrency): string =>
	currencies[currencyId].glyph;

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number) =>
	getCurrencySymbol(currencyId) + fixDecimals(price);

const getPromotionLabel = (promotion: Promotion | null) => {
	if (!promotion || !promotion.discount) {
		return null;
	}

	return `Save ${Math.round(promotion.discount.amount)}%`;
};

const getMainDisplayPrice = (
	productPrice: ProductPrice,
	promotion?: Promotion | null,
): number => {
	if (promotion) {
		const introductoryPrice = promotion.introductoryPrice?.price;
		return getFirstValidPrice(
			promotion.discountedPrice,
			introductoryPrice,
			productPrice.price,
		);
	}

	return productPrice.price;
};

const weeklyProductProps = (
	billingPeriod: WeeklyBillingPeriod,
	productPrice: ProductPrice,
	orderIsAGift = false,
) => {
	const promotion = getAppliedPromo(productPrice.promotions);
	const mainDisplayPrice = getMainDisplayPrice(productPrice, promotion);
	const offerCopy = promotion?.landingPage?.roundel ?? '';
	const trackingProperties = {
		id: orderIsAGift
			? `subscribe_now_cta_gift-${billingPeriod}`
			: `subscribe_now_cta-${billingPeriod}`,
		product: 'GuardianWeekly' as SubscriptionProduct,
		componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
	};

	return {
		title: billingPeriodTitle(billingPeriod, orderIsAGift),
		price: getPriceWithSymbol(productPrice.currency, mainDisplayPrice),
		offerCopy,
		priceCopy: (
			<span>{getSimplifiedPriceDescription(productPrice, billingPeriod)}</span>
		),
		buttonCopy: 'Subscribe now',
		href: getCheckoutUrl(billingPeriod, orderIsAGift),
		label: getPromotionLabel(promotion) ?? '',
		onClick: sendTrackingEventsOnClick(trackingProperties),
		onView: sendTrackingEventsOnView(trackingProperties),
	};
};

type WeeklyProductPricesProps = {
	countryId: IsoCountry;
	productPrices: ProductPrices | null | undefined;
	orderIsAGift: boolean;
	participations: Participations;
};

const getProducts = ({
	countryId,
	productPrices,
	orderIsAGift,
	participations,
}: WeeklyProductPricesProps): Product[] => {
	const billingPeriodsToUse = orderIsAGift
		? weeklyGiftBillingPeriods
		: weeklyBillingPeriods;

	if (participations.sixForSixSuppression === 'variant') {
		const index = billingPeriodsToUse.indexOf('SixWeekly');
		if (index >= 0) billingPeriodsToUse.splice(index, 1);
	}

	return billingPeriodsToUse.map((billingPeriod) => {
		const productPrice = productPrices
			? getProductPrice(
					productPrices,
					countryId,
					billingPeriod,
					getWeeklyFulfilmentOption(countryId),
			  )
			: {
					price: 0,
					fixedTerm: false,
					currency: 'GBP' as IsoCurrency,
			  };

		return weeklyProductProps(billingPeriod, productPrice, orderIsAGift);
	});
};

// const WeeklyHero: React.FC<PropTypes> = ({
// 	orderIsAGift,
// 	countryGroupId,
// 	promotionCopy,
// 	participations,
// }: PropTypes) => {
const WeeklyProductPrices: React.FC<WeeklyProductPricesProps> = ({
	countryId,
	productPrices,
	orderIsAGift,
	participations,
}: WeeklyProductPricesProps) => {
	if (!productPrices) {
		return null;
	}

	const products = getProducts({
		countryId,
		productPrices,
		orderIsAGift,
		participations,
	});
	return <Prices products={products} orderIsAGift={orderIsAGift} />;
}; // ----- Exports ----- //

export default WeeklyProductPrices;
