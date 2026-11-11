import type { Currency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { CountryCode } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { NoFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getProductPrice, isNumeric } from 'helpers/productPrice/productPrices';
import { getPromotionDiscountedPrice } from 'helpers/productPrice/promotionPricing';
import { getQueryParameter } from 'helpers/urls/url';

dayjs.extend(advancedFormat);

type DiscountBenefit = {
	amount: number;
	durationMonths?: number;
};
type PromotionCopy = {
	title?: string;
	description?: string;
	roundel?: string;
};
export type Promotion = {
	name: string;
	description: string;
	promoCode: string;
	isIntroductoryPricing: boolean;
	discountedPrice?: number;
	numberOfDiscountedPeriods?: number;
	discount?: DiscountBenefit;
	landingPage?: PromotionCopy;
	starts?: string;
	expires?: string;
	roundelText?: string;
	hasPriority?: boolean;
};

const hasDiscount = (
	promotion?: Promotion,
): promotion is Promotion & Required<Pick<Promotion, 'discountedPrice'>> =>
	isNumeric(promotion?.discountedPrice);

function applyDiscount(
	price: ProductPrice,
	promotion?: Promotion,
): ProductPrice {
	if (hasDiscount(promotion)) {
		return { ...price, price: promotion.discountedPrice };
	}
	return price;
}

const matchesQueryParam = (promotion: Promotion) =>
	getQueryParameter('promoCode') === promotion.promoCode;

function getAppliedPromo(promotions?: Promotion[]): Promotion | undefined {
	if (promotions && promotions.length > 0) {
		if (promotions.length > 1) {
			return promotions.find(matchesQueryParam) ?? promotions[0];
		}

		return promotions[0];
	}

	return undefined;
}

function getPromotion(
	productPrices: ProductPrices,
	country: CountryCode,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): Promotion | undefined {
	/*
  getProductPrice can raise an Error if not available (ie Storybook)
  this try/catch wrapper ensures its returned as undefined as specified,
  getProductPrice (used throughout) safer to remain un-changed
  */
	try {
		return getAppliedPromo(
			getProductPrice(
				productPrices,
				country,
				billingPeriod,
				fulfilmentOption,
				productOption,
			).promotions,
		);
	} catch (error) {
		return undefined;
	}
}

function finalPrice(
	productPrices: ProductPrices,
	country: CountryCode,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): ProductPrice {
	return applyDiscount(
		getProductPrice(
			productPrices,
			country,
			billingPeriod,
			fulfilmentOption,
			productOption,
		),
		getPromotion(
			productPrices,
			country,
			billingPeriod,
			fulfilmentOption,
			productOption,
		),
	);
}

const discountSummaryCopy = (
	currency: Currency,
	price: number,
	promotion: PromoWithCatalogInformation,
	billingPeriod: BillingPeriod,
) => {
	/**
	 * EXAMPLE:
	 * - £6/month for the first month, then £10/month
	 * - £6.5/month for 6 months, then £10/month
	 * - £173/year for the first year, then £275/year
	 */
	const durationMonths = promotion.discount?.durationMonths ?? 0;
	const formattedPrice = simpleFormatAmount(currency, price);
	const formattedPromotionPrice = simpleFormatAmount(
		currency,
		getPromotionDiscountedPrice(promotion, price, billingPeriod) ?? 0,
	);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const duration =
		billingPeriod === BillingPeriod.Annual
			? durationMonths / 12
			: durationMonths;

	return `${formattedPromotionPrice}/${periodNoun} for ${
		periodNoun === 'year' || duration === 1 ? 'the first' : ''
	}${duration > 1 ? duration : ''} ${periodNoun}${
		duration > 1 ? 's' : ''
	}, then ${formattedPrice}/${periodNoun}`;
};

function buildThreeTierCardPromoTerms(
	discountMarker: string,
	productName: string,
	discountSummary: string,
	{ startTimestamp, endTimestamp }: PromoWithCatalogInformation,
): string {
	const startDate = dayjs(startTimestamp).format('Do MMMM'); // eg. 15th January
	const expiryDate = dayjs(endTimestamp).format('Do MMMM YYYY'); // eg. 31st April 2028
	const promoDuration =
		startTimestamp && endTimestamp
			? `Offer starts on the ${startDate} and ends on the ${expiryDate}.`
			: '';

	return ` ${discountMarker} ${productName} offer is ${discountSummary} afterwards unless you cancel.
			Offer only available to new subscribers who do not have an existing subscription with the Guardian. 
			${promoDuration}`;
}

export {
	getAppliedPromo,
	applyDiscount,
	hasDiscount,
	finalPrice,
	discountSummaryCopy,
	buildThreeTierCardPromoTerms,
};
