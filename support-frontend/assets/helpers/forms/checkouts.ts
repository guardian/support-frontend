// ----- Imports ----- //
import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';

function roundAmount(amount: number) {
	/**
	 * This rounds a `number` to the second decimal.
	 *
	 * `Number.toFixed` returns a string which is not useful for calculations
	 * and would need unnecessary type conversions
	 */
	return Math.round(amount * 1e2) / 1e2;
}

function roundTaxAmount(amount: number) {
	/**
	 * This rounds a `number` down to the second decimal.
	 *
	 * `Number.toFixed` returns a string which is not useful for calculations
	 * and would need unnecessary type conversions
	 */
	return Math.floor(amount * 1e2) / 1e2;
}

const simpleFormatAmount = (
	currency: CurrencyInfo,
	amount: number,
	roundFn: (value: number) => number = roundAmount,
): string => {
	/**
	 * We need to round the amount before checking if it is an Int for the edge case of something like 12.0001
	 * which would not be an int, but then format as 12.00, whereas we'd like 12.
	 */
	const roundedAmount = roundFn(amount);
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
	return simpleFormatAmount(currency, taxAmount, roundTaxAmount);
}

// ----- Exports ----- //
export {
	simpleFormatAmount,
	simpleFormatTaxAmount,
	roundAmount,
	roundTaxAmount,
	calculateTax,
};
