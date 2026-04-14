// ----- Imports ----- //
import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';

// ----- Types ----- //
export type PaymentMethodSwitch =
	| 'directDebit'
	| 'payPal'
	| 'payPalCompletePayments'
	| 'stripe'
	| 'stripeHostedCheckout';

function round(amount: number) {
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
	const roundedAmount = round(amount);
	const isInt = roundedAmount % 1 === 0;
	/** only add the percentile amount if it's not a round integer */
	const amountText = isInt
		? roundedAmount.toString()
		: roundedAmount.toFixed(2);

	return `${currency.glyph}${amountText}`.trim();
};

const formatAmount = (
	currency: CurrencyInfo,
	amount: number,
	verbose: boolean,
): string => {
	if (verbose) {
		return `${amount} ${
			amount === 1 ? currency.spokenCurrency : `${currency.spokenCurrency}s`
		}`;
	}

	return simpleFormatAmount(currency, amount);
};

// ----- Exports ----- //
export { simpleFormatAmount, formatAmount };
