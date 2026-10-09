import type { CountryCode } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
} from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import {
	BillingPeriod,
	type RecurringBillingPeriod,
} from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { Product } from 'components/product/productOption';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { glyph } from 'helpers/internationalisation/currency';
import { internationaliseProduct } from 'helpers/productCatalog';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import {
	getBillingPeriodNoun,
	getBillingPeriodTitle,
} from 'helpers/productPrice/billingPeriods';
import { getDiscountedPrice } from 'helpers/productPrice/discountedPrice';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	fixDecimals,
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import type { OphanComponentType } from 'helpers/tracking/trackingOphan';
import { addQueryParamsToURL, getOrigin } from 'helpers/urls/url';
import { logException } from 'helpers/utilities/logger';
import { getDiscountSummary } from 'pages/[countryGroupId]/student/helpers/discountDetails';
import {
	getWeeklyGiftSavingsText,
	getWeeklySavingsText,
} from './getSavingsText';

function getWeeklyRatePlan(
	billingPeriod: RecurringBillingPeriod,
	isGift: boolean,
): ActiveRatePlanKey {
	if (isGift) {
		return billingPeriod === BillingPeriod.Annual
			? 'OneYearGift'
			: 'ThreeMonthGift';
	}
	switch (billingPeriod) {
		case BillingPeriod.Annual:
			return 'AnnualPlus';
		case BillingPeriod.Quarterly:
			return 'QuarterlyPlus';
		case BillingPeriod.Monthly:
			return 'MonthlyPlus';
	}
}

const getCheckoutUrl = ({
	countryId,
	billingPeriod,
	isGift,
	promotion,
}: {
	countryId: CountryCode;
	billingPeriod: RecurringBillingPeriod;
	isGift: boolean;
	promotion?: PromoWithCatalogInformation;
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

const getPriceWithSymbol = (currencyId: CurrencyCode, price: number): string =>
	`${glyph(currencyId)}${fixDecimals(price)}`;

export const getWeeklyProducts = ({
	countryId,
	countryGroupId,
	productCatalog,
	promotions,
	promoCode,
	billingPeriods,
	isGift = false,
}: {
	countryId: CountryCode;
	countryGroupId: CountryGroupId;
	productCatalog: WindowProductCatalog;
	promotions: PromoWithCatalogInformation[];
	promoCode?: string;
	billingPeriods: RecurringBillingPeriod[];
	isGift?: boolean;
}): Product[] => {
	const { currency, supportRegionId } = countryGroups[countryGroupId];
	const productKey = internationaliseProduct(
		supportRegionId,
		'GuardianWeeklyDomestic',
	);

	const getPrice = (billingPeriod: RecurringBillingPeriod) =>
		productCatalog[productKey]?.ratePlans[
			getWeeklyRatePlan(billingPeriod, isGift)
		]?.pricing[currency];

	// Pre-compute prices for all billing periods
	const priceByBillingPeriod = Object.fromEntries(
		billingPeriods.map((billingPeriod) => [
			billingPeriod,
			getPrice(billingPeriod),
		]),
	) as Partial<Record<RecurringBillingPeriod, number>>;

	const billingPeriodsWithPrices = billingPeriods.flatMap((billingPeriod) => {
		const price = priceByBillingPeriod[billingPeriod];
		if (price === undefined) {
			logException(
				`No price found for ${productKey} billing period ${billingPeriod}`,
			);
			return [];
		}
		return [{ billingPeriod, price }];
	});

	return billingPeriodsWithPrices.map(({ billingPeriod, price }) => {
		const promotion = getAppliedPromotion(
			promotions,
			productKey,
			getWeeklyRatePlan(billingPeriod, isGift),
			promoCode,
		);
		const discountedPrice = promotion?.discount
			? getDiscountedPrice(price, promotion.discount, billingPeriod)
			: undefined;
		const trackingProperties = {
			id: `subscribe_now_cta_gift-${billingPeriod}`,
			product: 'GuardianWeekly' as SubscriptionProduct,
			componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
		};
		const displayPrice = isGift ? discountedPrice ?? price : price;
		const fullPriceWithCurrency = getPriceWithSymbol(currency, displayPrice);

		// Gifts are fixed term, eg. 'for 12 months'
		const priceCopy = isGift
			? `for ${getBillingPeriodNoun(billingPeriod, true)}`
			: '';
		const buttonCopy = isGift ? 'Subscribe now' : 'Subscribe';
		const is12for12 = promotion?.promoCode.startsWith('12for12') ?? false;
		const isBlackFriday =
			promotion?.promoCode.startsWith('GWBLACKFRIDAY') ?? false;
		const isSpecialOffer = isGift && (is12for12 || isBlackFriday);

		const discountPriceWithCurrency =
			discountedPrice !== undefined
				? getPriceWithSymbol(currency, discountedPrice)
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

		const savingsText = isGift
			? getWeeklyGiftSavingsText(billingPeriod, promotion, priceByBillingPeriod)
			: getWeeklySavingsText(promotion);

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
			savingsText,
			hasPromotion: !isGift && !!promotion,
			isPriorityPromo: isGift ? undefined : augmentedPromotion?.hasPriority,
			roundel: isGift ? undefined : augmentedPromotion?.roundelText,
			isSpecialOffer,
		};
	});
};

type AugmentedPromotion = PromoWithCatalogInformation & {
	roundelText?: string;
	hasPriority?: boolean;
};

const getAugmentedPromotion = (
	promotion: PromoWithCatalogInformation,
): AugmentedPromotion => {
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
