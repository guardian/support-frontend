import type { BillingPeriod } from '@modules/product/billingPeriod';
import {
	extendedGlyph,
	glyph as shortGlyph,
} from 'helpers/internationalisation/currency';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';
import { fixDecimals } from 'helpers/productPrice/subscriptions';

const displayPrice = (glyph: string, price: number): string =>
	`${glyph}${fixDecimals(price)}`;

const billingPeriodQuantifier = (
	numberOfBillingPeriods: number,
	noun: string,
	fixedTerm: boolean,
) => {
	if (fixedTerm) {
		return ` for ${noun}`;
	}

	return numberOfBillingPeriods > 1
		? `/${noun} for ${numberOfBillingPeriods} ${noun}s`
		: ` for 1 ${noun}`;
};

const standardRate = (
	glyph: string,
	price: number,
	billingPeriod: BillingPeriod,
	fixedTerm: boolean,
) => {
	const termPrepositon = fixedTerm ? 'for' : 'per';
	return `${displayPrice(
		glyph,
		price,
	)} ${termPrepositon} ${getBillingPeriodNoun(billingPeriod, fixedTerm)}`;
};

const getStandardRateCopy = (
	glyph: string,
	price: number,
	billingPeriod: BillingPeriod,
	fixedTerm: boolean,
) => {
	if (fixedTerm) {
		return '';
	}

	const standard = standardRate(glyph, price, billingPeriod, fixedTerm);
	return `, then ${standard}`;
};

function getDiscountDescription(
	glyph: string,
	price: number,
	fixedTerm: boolean,
	discountedPrice: number,
	numberOfDiscountedPeriods: number | null | undefined,
	billingPeriod: BillingPeriod,
) {
	const minNumberOfDiscountedPeriodsForPatrons = 100;

	if (
		numberOfDiscountedPeriods &&
		numberOfDiscountedPeriods >= minNumberOfDiscountedPeriodsForPatrons
	) {
		return "You won't pay anything for the duration of your Patrons membership";
	}

	if (numberOfDiscountedPeriods) {
		const discountCopy = `You'll pay ${displayPrice(
			glyph,
			discountedPrice,
		)}${billingPeriodQuantifier(
			numberOfDiscountedPeriods,
			getBillingPeriodNoun(billingPeriod, fixedTerm),
			fixedTerm,
		)}`;
		const standardCopy = getStandardRateCopy(
			glyph,
			price,
			billingPeriod,
			fixedTerm,
		);
		return `${discountCopy}${standardCopy}`;
	}

	return '';
}

function getPriceDescription(
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
	useExtendedGlyph = true,
): string {
	const glyphFn = useExtendedGlyph ? extendedGlyph : shortGlyph;
	const glyph = glyphFn(productPrice.currency);
	const promotion = getAppliedPromo(productPrice.promotions);

	if (hasDiscount(promotion)) {
		return getDiscountDescription(
			glyph,
			productPrice.price,
			productPrice.fixedTerm, // $FlowIgnore -- We have checked this in hasDiscount
			promotion.discountedPrice,
			promotion.numberOfDiscountedPeriods,
			billingPeriod,
		);
	}

	return standardRate(
		glyph,
		productPrice.price,
		billingPeriod,
		productPrice.fixedTerm,
	);
}

function getSimplifiedPriceDescription(
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
): string {
	const glyph = extendedGlyph(productPrice.currency);
	const promotion = getAppliedPromo(productPrice.promotions);
	const termPrepositon = productPrice.fixedTerm ? 'for' : 'per';
	const promoRateCopy = getStandardRateCopy(
		glyph,
		productPrice.price,
		billingPeriod,
		productPrice.fixedTerm,
	);
	return `${termPrepositon} ${getBillingPeriodNoun(
		billingPeriod,
		productPrice.fixedTerm,
	)}${hasDiscount(promotion) ? promoRateCopy : ''}`;
}

export { displayPrice, getPriceDescription, getSimplifiedPriceDescription };
