import type { OphanComponentType } from '@guardian/libs';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
} from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import {
	BillingPeriod,
	type RecurringBillingPeriod,
} from '@modules/product/billingPeriod';
import type { Product } from 'components/product/productOption';
import { getFeatureFlags } from 'helpers/featureFlags';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { glyph } from 'helpers/internationalisation/currency';
import { internationaliseProduct } from 'helpers/productCatalog';
import { getWeeklyFulfilmentOption } from 'helpers/productCatalogToFulfilmentOption';
import {
	billingPeriodToRatePlan,
	getBillingPeriodNoun,
	getBillingPeriodTitle,
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
} from 'helpers/productPrice/billingPeriods';
import { getSimplifiedPriceDescription } from 'helpers/productPrice/priceDescriptions';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import {
	getFirstValidPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	fixDecimals,
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import { addQueryParamsToURL, getOrigin } from 'helpers/urls/url';
import { getDiscountSummary } from 'pages/[countryGroupId]/student/helpers/discountDetails';

export type WeeklyProductPricesProps = {
	countryId: IsoCountry;
	productPrices: ProductPrices;
	orderIsAGift: boolean;
};

export const getProducts = ({
	countryId,
	productPrices,
	orderIsAGift,
}: WeeklyProductPricesProps): Product[] => {
	const { enableWeeklyDigital } = getFeatureFlags();

	const billingPeriodsToUse = orderIsAGift
		? weeklyGiftBillingPeriods
		: weeklyBillingPeriods;

	return billingPeriodsToUse.map((billingPeriod) => {
		const productPrice = getProductPrice(
			productPrices,
			countryId,
			billingPeriod,
			getWeeklyFulfilmentOption(countryId),
		);

		return enableWeeklyDigital
			? weeklyDigitalProduct(
					countryId,
					billingPeriod,
					productPrice,
					orderIsAGift,
			  )
			: weeklyProductProps(
					countryId,
					billingPeriod,
					productPrice,
					orderIsAGift,
			  );
	});
};

const countryPath = (countryGroupId: CountryGroupId) =>
	countryGroups[countryGroupId].supportRegionId;

const getCheckoutUrl = (
	countryId: IsoCountry,
	billingPeriod: RecurringBillingPeriod,
	orderIsGift: boolean,
	promotion?: Promotion,
): string => {
	const countryGroupId = CountryGroup.fromCountry(countryId) ?? GBPCountries;
	const productGuardianWeekly = internationaliseProduct(
		countryGroups[countryGroupId].supportRegionId,
		'GuardianWeeklyDomestic',
	);
	const url = `${getOrigin()}/${countryPath(countryGroupId)}/checkout`;
	return addQueryParamsToURL(url, {
		promoCode: promotion?.promoCode,
		product: productGuardianWeekly,
		ratePlan: billingPeriodToRatePlan(billingPeriod, orderIsGift),
	});
};

const getMainDisplayPrice = (
	productPrice: ProductPrice,
	promotion?: Promotion | null,
): number => {
	if (promotion) {
		return getFirstValidPrice(promotion.discountedPrice, productPrice.price);
	}

	return productPrice.price;
};

const getCurrencySymbol = (currencyId: IsoCurrency): string =>
	glyph(currencyId);

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number) =>
	getCurrencySymbol(currencyId) + fixDecimals(price);

const weeklyProductProps = (
	countryId: IsoCountry,
	billingPeriod: RecurringBillingPeriod,
	productPrice: ProductPrice,
	orderIsAGift = false,
): Product => {
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

	const is12for12 = promotion?.promoCode.startsWith('12for12') ?? false;
	const isBlackFriday =
		promotion?.promoCode.startsWith('GWBLACKFRIDAY') ?? false;

	return {
		title: getBillingPeriodTitle(billingPeriod, orderIsAGift),
		price: getPriceWithSymbol(productPrice.currency, mainDisplayPrice),
		discountedPrice: promotion?.discountedPrice
			? getPriceWithSymbol(productPrice.currency, promotion.discountedPrice)
			: undefined,
		billingPeriodNoun: getBillingPeriodNoun(billingPeriod, orderIsAGift),
		offerCopy,
		priceCopy: (
			<span>{getSimplifiedPriceDescription(productPrice, billingPeriod)}</span>
		),
		href: getCheckoutUrl(countryId, billingPeriod, orderIsAGift, promotion),
		showLabel: Boolean(promotion?.discount),
		onClick: sendTrackingEventsOnClick(trackingProperties),
		onView: sendTrackingEventsOnView(trackingProperties),
		isSpecialOffer: is12for12 || isBlackFriday,
		buttonCopy: 'Subscribe now',
	};
};

const weeklyDigitalProduct = (
	countryId: IsoCountry,
	billingPeriod: RecurringBillingPeriod,
	productPrice: ProductPrice,
	orderIsAGift = false,
): Product => {
	const promotion = getAppliedPromo(productPrice.promotions);

	const offerCopy = promotion?.landingPage?.roundel ?? '';
	const trackingProperties = {
		id: orderIsAGift
			? `subscribe_now_cta_gift-${billingPeriod}`
			: `subscribe_now_cta-${billingPeriod}`,
		product: 'GuardianWeekly' as SubscriptionProduct,
		componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
	};
	const fullPriceWithCurrency = getPriceWithSymbol(
		productPrice.currency,
		productPrice.price,
	);

	const discountPriceWithCurrency = promotion?.discountedPrice
		? getPriceWithSymbol(productPrice.currency, promotion.discountedPrice)
		: undefined;

	const durationInMonths = promotion?.discount?.durationMonths;

	const discountSummary =
		durationInMonths && discountPriceWithCurrency
			? getDiscountSummary({
					fullPriceWithCurrency,
					discountPriceWithCurrency,
					durationInMonths,
					billingPeriod,
			  })
			: undefined;

	return {
		title: getBillingPeriodTitle(billingPeriod, orderIsAGift),
		price: fullPriceWithCurrency,
		discountedPrice: discountPriceWithCurrency,
		billingPeriodNoun: getBillingPeriodNoun(billingPeriod, orderIsAGift),
		offerCopy,
		discountSummary,
		savingsText: getSimplifiedPriceDescription(productPrice, billingPeriod),
		href: getCheckoutUrl(countryId, billingPeriod, orderIsAGift, promotion),
		showLabel: billingPeriod === BillingPeriod.Quarterly,
		onClick: sendTrackingEventsOnClick(trackingProperties),
		onView: sendTrackingEventsOnView(trackingProperties),
		buttonCopy: 'Subscribe now',
	};
};
