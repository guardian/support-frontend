import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { discountDetailsSchema } from '@modules/promotions/v2/schema';
import type { z } from 'zod';

/*
 * A port of the discount calculations in the Scala PriceSummaryService, used to
 * work out promotional prices from promotions-api promotions (which, unlike the
 * legacy ProductPrices promotions, don't come with a pre-computed discounted price).
 */

type PromoDiscount = z.infer<typeof discountDetailsSchema>;

const monthsInPeriod: Record<RecurringBillingPeriod, number> = {
	[BillingPeriod.Monthly]: 1,
	[BillingPeriod.Quarterly]: 3,
	[BillingPeriod.Annual]: 12,
};

/**
 * Rounds a non-negative number to `decimalPlaces` using HALF_DOWN rounding
 * (ties round towards zero), matching Scala's `BigDecimal.setScale(n, HALF_DOWN)`.
 * Works on the decimal string representation so ties aren't lost to floating point error.
 */
function roundHalfDown(value: number, decimalPlaces: number): number {
	const [integerPart = '0', fractionalPart = ''] = (
		value.toString().includes('e') ? value.toFixed(20) : value.toString()
	).split('.');
	const kept = fractionalPart
		.slice(0, decimalPlaces)
		.padEnd(decimalPlaces, '0');
	const remainder = fractionalPart.slice(decimalPlaces);
	const isMoreThanHalf =
		remainder.charAt(0) > '5' ||
		(remainder.startsWith('5') && /[1-9]/.test(remainder.slice(1)));
	const truncated = Number(`${integerPart}${kept}`);
	return (truncated + (isMoreThanHalf ? 1 : 0)) / 10 ** decimalPlaces;
}

/**
 * If the discount doesn't cover a whole number of billing periods (eg. a 3 month
 * discount on an annual plan, or a 5 month discount on a quarterly plan), the
 * discount is scaled and spread evenly over every billing period it affects.
 */
function getDiscountScaledToPeriod(
	discount: PromoDiscount,
	billingPeriod: RecurringBillingPeriod,
): number {
	const proportionOfPeriodsDiscounted =
		discount.durationMonths / monthsInPeriod[billingPeriod];
	const numberOfPeriodsDiscounted = Math.ceil(proportionOfPeriodsDiscounted);
	return roundHalfDown(
		(discount.amount * proportionOfPeriodsDiscounted) /
			numberOfPeriodsDiscounted,
		3,
	);
}

export function getNumberOfDiscountedPeriods(
	durationMonths: number,
	billingPeriod: RecurringBillingPeriod,
): number {
	return Math.ceil(durationMonths / monthsInPeriod[billingPeriod]);
}

/** The price per billing period while the discount applies, to 2 decimal places. */
export function getDiscountedPrice(
	price: number,
	discount: PromoDiscount,
	billingPeriod: RecurringBillingPeriod,
): number {
	// Integer arithmetic (price in pence, discount in thousandths of a percent) keeps this exact
	const oneHundredPercentInThousandths = 100 * 1000;
	const priceInMinorUnits = Math.round(price * 100);
	const discountInThousandthsOfPercent = Math.round(
		getDiscountScaledToPeriod(discount, billingPeriod) * 1000,
	);

	const discountedPriceScaled =
		priceInMinorUnits *
		(oneHundredPercentInThousandths - discountInThousandthsOfPercent);
	const discountedPriceInMinorUnits = Math.floor(
		discountedPriceScaled / oneHundredPercentInThousandths,
	);
	const remainder = discountedPriceScaled % oneHundredPercentInThousandths;
	const isMoreThanHalf = remainder * 2 > oneHundredPercentInThousandths;
	return (discountedPriceInMinorUnits + (isMoreThanHalf ? 1 : 0)) / 100;
}
