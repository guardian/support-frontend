import React from 'react';
import snarkdown from 'snarkdown';
import DOMPurify from 'dompurify';
import { getQueryParameter } from 'helpers/urls/url';
import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getProductPrice, isNumeric } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
export type DiscountBenefit = {
	amount: number;
	durationMonths?: number;
};
export type IntroductoryPeriodType = 'issue';
export type IntroductoryPriceBenefit = {
	price: number;
	periodLength: number;
	periodType: IntroductoryPeriodType;
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
	introductoryPrice?: IntroductoryPriceBenefit;
	landingPage?: PromotionCopy;
};
const promoQueryParam = 'promoCode';

const hasDiscount = (promotion: Promotion | null | undefined): boolean =>
	promotion !== null &&
	promotion !== undefined &&
	isNumeric(promotion.discountedPrice);

const hasIntroductoryPrice = (
	promotion: Promotion | null | undefined,
): boolean =>
	promotion !== null &&
	promotion !== undefined &&
	!!promotion.introductoryPrice;

function applyDiscount(
	price: ProductPrice,
	promotion: Promotion | null | undefined,
) {
	if (hasDiscount(promotion)) {
		return { ...price, price: promotion.discountedPrice };
	} else if (hasIntroductoryPrice(promotion)) {
		return {
			...price,
			// $FlowIgnore - we have checked this above
			price: promotion.introductoryPrice.price,
		};
	}

	return price;
}

const matchesQueryParam = (promotion) =>
	getQueryParameter(promoQueryParam) === promotion.promoCode;

const introductoryPrice = (promotion) =>
	promotion.introductoryPrice !== null &&
	promotion.introductoryPrice !== undefined;

function getAppliedPromo(
	promotions: Promotion[] | null | undefined,
): Option<Promotion> {
	if (promotions && promotions.length > 0) {
		if (promotions.length > 1) {
			return (
				promotions.find(introductoryPrice) ||
				promotions.find(matchesQueryParam) ||
				promotions[0]
			);
		}

		return promotions[0];
	}

	return null;
}

function getPromotion(
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions | null | undefined,
	productOption: ProductOptions | null | undefined,
): Promotion | null | undefined {
	return getAppliedPromo(
		getProductPrice(
			productPrices,
			country,
			billingPeriod,
			fulfilmentOption,
			productOption,
		).promotions,
	);
}

function getSanitisedHtml(markdownString: string) {
	// ensure we don't accidentally inject dangerous html into the page
	return DOMPurify.sanitize(snarkdown(markdownString), {
		ALLOWED_TAGS: ['em', 'strong', 'ul', 'li', 'a', 'p'],
	});
}

function getPromotionCopy(
	promotionCopy: PromotionCopy | null | undefined,
): PromotionCopy {
	if (!promotionCopy) {
		return {};
	}

	return {
		title: promotionCopy.title || '',
		description: getSanitisedHtml(promotionCopy.description || ''),
		roundel: getSanitisedHtml(promotionCopy.roundel || ''),
	};
}

type PromotionHTMLModifiers = {
	css?: string;
	tag?: string;
};

function promotionHTML(
	html?: string,
	{ css = '', tag = 'span' }: PromotionHTMLModifiers = {},
) {
	if (!html) {
		return null;
	}

	const TagName = tag;
	return (
		<TagName
			css={css} // eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{
				__html: html,
			}}
		/>
	);
}

export {
	getPromotion,
	getAppliedPromo,
	applyDiscount,
	hasIntroductoryPrice,
	hasDiscount,
	promoQueryParam,
	getPromotionCopy,
	promotionHTML,
};
