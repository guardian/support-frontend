// ----- Imports ----- //
import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';

function roundAmount(amount: number) {
	/**
	 * This rounds a `number` to the second decimal.
	 *
	 * `Number.toFixed` returns a string which is not useful for calculations
	 * and would need unnecessary type conversions
	 */
	return Math.round(amount * 1e2) / 1e2;
}

const simpleFormatAmount = (currency: CurrencyInfo, amount: number): string => {
	/**
	 * We need to round the amount before checking if it is an Int for the edge case of something like 12.0001
	 * which would not be an int, but then format as 12.00, whereas we'd like 12.
	 */
	const roundedAmount = roundAmount(amount);
	const isInt = roundedAmount % 1 === 0;
	/** only add the percentile amount if it's not a round integer */
	const amountText = isInt
		? roundedAmount.toString()
		: roundedAmount.toFixed(2);

	return `${currency.glyph}${amountText}`.trim();
};

function calculateTax(amount: number, taxRate: number): number {
	// Multiply to avoid floating point precision issues. Should we be using a
	// library for this?
	return (amount * (taxRate * 100000)) / 100000;
}

function simpleFormatTaxAmount(
	currency: CurrencyInfo,
	amount: number,
	taxRate: number, // A decimal, e.g. 0.15
): string {
	const taxAmount = calculateTax(amount, taxRate);
	return simpleFormatAmount(currency, taxAmount);
}

function calculateAndFormatTotal(
	taxRateConfig: TaxRateConfig,
	currency: CurrencyInfo,
	amount: number,
	amountExclDiscount: number,
): string {
	switch (taxRateConfig.type) {
		case 'tax_inclusive':
		case 'not_enough_information':
			return simpleFormatAmount(currency, amount);
		case 'tax_exclusive': {
			// It's important that the rounding here reflects the individual amounts
			// otherwise we may show the user a calculation which doesn't add up:
			// Amounts are rounded the usual way:
			const roundedTotal = roundAmount(amount);
			const roundedDownTaxAmount = roundAmount(
				calculateTax(amount, taxRateConfig.rate),
			);
			const totalWithTax = roundedTotal + roundedDownTaxAmount;

			if (amountExclDiscount === amount) {
				return simpleFormatAmount(currency, totalWithTax);
			} else {
				const roundedExclDiscountTotal = roundAmount(amountExclDiscount);
				const roundedDownTaxExclDiscountAmount = roundAmount(
					calculateTax(amountExclDiscount, taxRateConfig.rate),
				);
				const totalExclDiscountWithTax =
					roundedExclDiscountTotal + roundedDownTaxExclDiscountAmount;

				// This reflects the Zuora invoice calculation
				// Due Today = Total Excl Discount With Tax - Total Incl Discount With Tax
				return simpleFormatAmount(
					currency,
					totalExclDiscountWithTax - totalWithTax,
				);
			}
		}
	}
}

// ----- Exports ----- //
export {
	simpleFormatAmount,
	simpleFormatTaxAmount,
	calculateTax,
	calculateAndFormatTotal,
};
