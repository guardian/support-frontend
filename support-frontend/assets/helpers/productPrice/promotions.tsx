import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { NoFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getProductPrice, isNumeric } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import { getQueryParameter } from 'helpers/urls/url';
import { getSanitisedHtml } from '../utilities/utilities';

type DiscountBenefit = {
	amount: number;
	durationMonths?: number;
};
export type PromotionCopy = {
	title?: string;
	description?: string;
	roundel?: string;
};
export type PromotionTerms = {
	description: string;
	starts: Date;
	expires: Option<Date>;
	product: SubscriptionProduct;
	// actually only GuardianWeekly, Paper or Digital Pack?
	productRatePlans: string[];
	promoCode: string;
	isGift: boolean;
};
export type Promotion = {
	name: string;
	description: string;
	promoCode: string;
	discountedPrice?: number;
	numberOfDiscountedPeriods?: number;
	discount?: DiscountBenefit;
	landingPage?: PromotionCopy;
	starts?: string;
	expires?: string;
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
	country: IsoCountry,
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

function getPromotionCopy(
	promotionCopy?: PromotionCopy | null,
	isGift?: boolean | null,
): PromotionCopy {
	if (!promotionCopy) {
		return {};
	}
	const msgFirstPerson = isGift ? 'their' : 'your';
	return {
		title: promotionCopy.title ?? `Open up ${msgFirstPerson} world view`,
		description: getSanitisedHtml(promotionCopy.description ?? ''),
		roundel: getSanitisedHtml(promotionCopy.roundel ?? ''),
	};
}

type PromotionHTMLModifiers = {
	css?: string;
	tag?: keyof JSX.IntrinsicElements;
};

function promotionHTML(
	html?: string,
	{ css = '', tag = 'span' }: PromotionHTMLModifiers = {},
): JSX.Element | null {
	if (!html) {
		return null;
	}

	const TagName = tag;
	return (
		<TagName
			css={css}
			dangerouslySetInnerHTML={{
				__html: html,
			}}
		/>
	);
}

function finalPrice(
	productPrices: ProductPrices,
	country: IsoCountry,
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
	currency: CurrencyInfo,
	promotionIndex: number,
	price: number,
	promotion: Promotion,
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
		promotion.discountedPrice ?? 0,
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
	}, then ${formattedPrice}/${periodNoun}${'*'.repeat(promotionIndex + 1)}`;
};

export {
	getPromotion,
	getAppliedPromo,
	applyDiscount,
	hasDiscount,
	getPromotionCopy,
	promotionHTML,
	finalPrice,
	discountSummaryCopy,
};
