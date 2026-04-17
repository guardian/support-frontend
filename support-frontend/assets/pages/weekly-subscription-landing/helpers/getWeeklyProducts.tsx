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
import {
	getDiscountDuration,
	getDiscountSummary,
} from 'pages/[countryGroupId]/student/helpers/discountDetails';

function getWeeklyRatePlan(
	billingPeriod: RecurringBillingPeriod,
	isGift: boolean,
): string {
	if (isGift) {
		return billingPeriod === BillingPeriod.Annual
			? 'OneYearGift'
			: 'ThreeMonthGift';
	}
	return billingPeriod.toString() + 'Plus';
}

const getCheckoutUrl = ({
	countryId,
	billingPeriod,
	isGift,
	promotion,
}: {
	countryId: IsoCountry;
	billingPeriod: RecurringBillingPeriod;
	isGift: boolean;
	promotion?: Promotion;
}) => {
	const countryGroupId = CountryGroup.fromCountry(countryId) ?? GBPCountries;
	const productGuardianWeekly = internationaliseProduct(
		countryGroups[countryGroupId].supportRegionId,
		'GuardianWeeklyDomestic',
	);
	const region = countryGroups[countryGroupId].supportRegionId;

	const url = `${getOrigin()}/${region}/checkout`;
	const urlWithParams = addQueryParamsToURL(url, {
		promoCode: promotion?.promoCode,
		product: productGuardianWeekly,
		ratePlan: getWeeklyRatePlan(billingPeriod, isGift),
	});
	return urlWithParams;
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

export const getWeeklyProducts = ({
	countryId,
	productPrices,
	billingPeriods,
	isGift = false,
}: {
	countryId: IsoCountry;
	productPrices: ProductPrices;
	billingPeriods: RecurringBillingPeriod[];
	isGift?: boolean;
}): Product[] =>
	billingPeriods.map((billingPeriod) => {
		const productPrice = getProductPrice(
			productPrices,
			countryId,
			billingPeriod,
			getWeeklyFulfilmentOption(countryId),
			isGift ? 'NoProductOptions' : 'PlusDigital',
		);
		const promotion = getAppliedPromo(productPrice.promotions);
		const trackingProperties = {
			id: `subscribe_now_cta_gift-${billingPeriod}`,
			product: 'GuardianWeekly' as SubscriptionProduct,
			componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
		};
		const displayPrice = getDisplayPrice(
			productPrice,
			isGift ? promotion : null,
		);
		const fullPriceWithCurrency = getPriceWithSymbol(
			productPrice.currency,
			displayPrice,
		);

		const offerCopy = isGift
			? promotion?.landingPage?.roundel ?? ''
			: undefined;
		const priceCopy = isGift
			? getSimplifiedPriceDescription(productPrice, billingPeriod)
			: '';
		const buttonCopy = isGift ? 'Subscribe now' : 'Subscribe';
		const is12for12 = promotion?.promoCode.startsWith('12for12') ?? false;
		const isBlackFriday =
			promotion?.promoCode.startsWith('GWBLACKFRIDAY') ?? false;
		const isSpecialOffer = isGift && (is12for12 || isBlackFriday);

		const discountPriceWithCurrency = promotion?.discountedPrice
			? getPriceWithSymbol(productPrice.currency, promotion.discountedPrice)
			: undefined;
		const durationInMonths = promotion?.discount?.durationMonths;
		const discountSummary =
			!isGift && durationInMonths && discountPriceWithCurrency
				? getDiscountSummary({
						fullPriceWithCurrency,
						discountPriceWithCurrency,
						durationInMonths,
						billingPeriod,
						shortFormat: true,
				  })
				: undefined;
		const savingsText =
			!isGift && promotion?.discount?.amount && durationInMonths
				? `Save ${promotion.discount.amount}% for ${getDiscountDuration({
						durationInMonths,
				  })}`
				: undefined;

		const augmentedPromotion = promotion && getAugmentedPromotion(promotion);
		return {
			title: getBillingPeriodTitle(billingPeriod, isGift),
			price: fullPriceWithCurrency,
			href: getCheckoutUrl({
				countryId,
				billingPeriod,
				isGift,
				promotion,
			}),
			priceCopy,
			buttonCopy,
			onClick: sendTrackingEventsOnClick(trackingProperties),
			onView: sendTrackingEventsOnView(trackingProperties),
			billingPeriodNoun: getBillingPeriodNoun(billingPeriod, isGift),
			billingPeriod: isGift ? undefined : billingPeriod,
			discountedPrice: discountPriceWithCurrency,
			discountSummary,
			offerCopy,
			savingsText,
			hasPromotion: !isGift && !!promotion,
			isPriorityPromo: isGift ? undefined : augmentedPromotion?.hasPriority,
			roundel: isGift ? undefined : augmentedPromotion?.roundelText,
			isSpecialOffer,
		};
	});

const getAugmentedPromotion = (promotion: Promotion): Promotion => {
	// TODO: This is a temporary function to augment the promotion with additional properties until we have the ability to add custom copy for specific promotions in the promo tool.
	//       The keys in here must stay up to date with the one in promo tool in order to be able to augment the promotion correctly.
	switch (promotion.promoCode) {
		case 'GWPLUSDIGITAL':
			return {
				...promotion,
				roundelText: 'Intro offer | 50% Off',
				hasPriority: true,
			};
		case '25ANNUAL':
			return {
				...promotion,
				roundelText: 'Best value',
			};
		default:
			return promotion;
	}
};
