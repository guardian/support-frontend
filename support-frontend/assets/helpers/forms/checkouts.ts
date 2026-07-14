// ----- Imports ----- //
import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';

/**
 * - `originalAmount` the amount pre any discounts or contributions
 * - `discountedAmount` the amount with a discountApplied
 * - `finalAmount` is the amount a person will pay
 */
export type Payment = {
	originalAmount: number;
	discountedAmount?: number;
	contributionAmount?: number;
	finalAmount: number;
};

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

function calculateAndRoundTax(payment: Payment, taxRate: number): number {
	const { originalAmount, finalAmount } = payment;

	// Multiply to avoid floating point precision issues. Should we be using a
	// library for this?
	const taxOnOriginalAmount = roundAmount(
		(originalAmount * (taxRate * 100000)) / 100000,
	);

	if (originalAmount === finalAmount) {
		return taxOnOriginalAmount;
	}

	const discountAmount = originalAmount - finalAmount;
	const taxOnDiscountAmount = roundAmount(
		(discountAmount * (taxRate * 100000)) / 100000,
	);

	return taxOnOriginalAmount - taxOnDiscountAmount;
}

function simpleFormatTaxAmount(
	currency: CurrencyInfo,
	payment: Payment,
	taxRate: number, // A decimal, e.g. 0.15
): string {
	const taxAmount = calculateAndRoundTax(payment, taxRate);
	return simpleFormatAmount(currency, taxAmount);
}

function calculateAndFormatTotal(
	taxRateConfig: TaxRateConfig,
	currency: CurrencyInfo,
	payment: Payment,
): string {
	const { finalAmount } = payment;

	switch (taxRateConfig.type) {
		case 'tax_inclusive':
		case 'not_enough_information':
			return simpleFormatAmount(currency, finalAmount);
		case 'tax_exclusive': {
			// It's important that the rounding here reflects the individual amounts
			// otherwise we may show the user a calculation which doesn't add up:
			// Amounts are rounded the usual way:
			const roundedTotal = roundAmount(finalAmount);

			const tax = calculateAndRoundTax(payment, taxRateConfig.rate);

			return simpleFormatAmount(currency, roundedTotal + tax);
		}
	}
}

// ----- Exports ----- //
export {
	simpleFormatAmount,
	simpleFormatTaxAmount,
	calculateAndRoundTax,
	calculateAndFormatTotal,
};
