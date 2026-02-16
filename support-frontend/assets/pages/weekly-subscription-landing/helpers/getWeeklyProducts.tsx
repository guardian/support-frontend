import type { IsoCountry } from '@modules/internationalisation/country';
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
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { glyph } from 'helpers/internationalisation/currency';
import { internationaliseProduct } from 'helpers/productCatalog';
import { getWeeklyFulfilmentOption } from 'helpers/productCatalogToFulfilmentOption';
import {
	billingPeriodToRatePlan,
	getBillingPeriodNoun,
	getBillingPeriodTitle,
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
import type { OphanComponentType } from 'helpers/tracking/trackingOphan';
import { addQueryParamsToURL, getOrigin } from 'helpers/urls/url';
import { getDiscountSummary } from 'pages/[countryGroupId]/student/helpers/discountDetails';

const getCheckoutUrl = ({
	countryId,
	billingPeriod,
	orderIsGift,
	enableWeeklyDigitalPlans,
	promotion,
}: {
	countryId: IsoCountry;
	billingPeriod: RecurringBillingPeriod;
	orderIsGift: boolean;
	enableWeeklyDigitalPlans: boolean;
	promotion?: Promotion;
}) => {
	const countryGroupId = CountryGroup.fromCountry(countryId) ?? GBPCountries;
	const productGuardianWeekly = internationaliseProduct(
		countryGroups[countryGroupId].supportRegionId,
		'GuardianWeeklyDomestic',
	);
	const region = countryGroups[countryGroupId].supportRegionId;

	const url = `${getOrigin()}/${region}/checkout`;
	return addQueryParamsToURL(url, {
		promoCode: promotion?.promoCode,
		product: productGuardianWeekly,
		ratePlan: billingPeriodToRatePlan(
			billingPeriod,
			orderIsGift,
			enableWeeklyDigitalPlans,
		),
	});
};

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number): string =>
	`${glyph(currencyId)}${fixDecimals(price)}`;

const getDisplayPrice = (
	productPrice: ProductPrice,
	promotion?: Promotion | null,
): number => {
	if (promotion) {
		return getFirstValidPrice(promotion.discountedPrice, productPrice.price);
	}

	return productPrice.price;
};

// TODO: Decomission this function after non digital weekly products are removed
export const getProducts = ({
	countryId,
	productPrices,
	billingPeriods,
	orderIsAGift,
}: {
	countryId: IsoCountry;
	productPrices: ProductPrices;
	billingPeriods: RecurringBillingPeriod[];
	orderIsAGift: boolean;
}): Product[] =>
	billingPeriods.map((billingPeriod) => {
		const productPrice = getProductPrice(
			productPrices,
			countryId,
			billingPeriod,
			getWeeklyFulfilmentOption(countryId),
			'NoProductOptions',
		);

		const promotion = getAppliedPromo(productPrice.promotions);
		const displayPrice = getDisplayPrice(productPrice, promotion);
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
			price: getPriceWithSymbol(productPrice.currency, displayPrice),
			discountedPrice: promotion?.discountedPrice
				? getPriceWithSymbol(productPrice.currency, promotion.discountedPrice)
				: undefined,
			billingPeriodNoun: getBillingPeriodNoun(billingPeriod, orderIsAGift),
			offerCopy,
			priceCopy: getSimplifiedPriceDescription(productPrice, billingPeriod),
			buttonCopy: 'Subscribe now',
			href: getCheckoutUrl({
				countryId,
				billingPeriod,
				orderIsGift: orderIsAGift,
				enableWeeklyDigitalPlans: false,
				promotion,
			}),
			onClick: sendTrackingEventsOnClick(trackingProperties),
			onView: sendTrackingEventsOnView(trackingProperties),
			isSpecialOffer: is12for12 || isBlackFriday,
		};
	});

export const getWeeklyDigitalRatePlans = ({
	countryId,
	productPrices,
	weeklyBillingPeriods,
}: {
	countryId: IsoCountry;
	productPrices: ProductPrices;
	weeklyBillingPeriods: RecurringBillingPeriod[];
}): Product[] =>
	weeklyBillingPeriods.map((billingPeriod) => {
		const productPrice = getProductPrice(
			productPrices,
			countryId,
			billingPeriod,
			getWeeklyFulfilmentOption(countryId),
			'PlusDigital',
		);

		const promotion = getAppliedPromo(productPrice.promotions);

		const trackingProperties = {
			id: `subscribe_now_cta-${billingPeriod}`,
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
			title: getBillingPeriodTitle(billingPeriod),
			price: fullPriceWithCurrency,
			discountedPrice: discountPriceWithCurrency,
			billingPeriodNoun: getBillingPeriodNoun(billingPeriod),
			discountSummary,
			priceCopy: '',
			savingsText: promotion?.landingPage?.roundel ?? '',
			href: getCheckoutUrl({
				countryId,
				billingPeriod,
				orderIsGift: false,
				enableWeeklyDigitalPlans: true,
				promotion,
			}),
			showLabel: billingPeriod === BillingPeriod.Quarterly,
			onClick: sendTrackingEventsOnClick(trackingProperties),
			onView: sendTrackingEventsOnView(trackingProperties),
			buttonCopy: 'Subscribe now',
		};
	});
