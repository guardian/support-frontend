// ----- Imports ----- //
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	DirectDebit,
	PayPal,
	Sepa,
	Stripe,
	StripeHostedCheckout,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type {
	Currency,
	SpokenCurrency,
} from 'helpers/internationalisation/currency';

// ----- Types ----- //
export type PaymentMethodSwitch =
	| 'directDebit'
	| 'sepa'
	| 'payPal'
	| 'stripe'
	| 'stripeHostedCheckout';

// ----- Functions ----- //
function toPaymentMethodSwitchNaming(
	paymentMethod: PaymentMethod,
): PaymentMethodSwitch | null {
	switch (paymentMethod) {
		case PayPal:
			return 'payPal';

		case Stripe:
			return 'stripe';

		case DirectDebit:
			return 'directDebit';

		case StripeHostedCheckout:
			return 'stripeHostedCheckout';

		case Sepa:
			return 'sepa';

		default:
			return null;
	}
}

// Returns an array of Payment Methods, in the order of preference,
// i.e the first element in the array will be the default option
function getPaymentMethods(
	contributionType: ContributionType,
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
): PaymentMethod[] {
	const nonRegionSpecificPaymentMethods: PaymentMethod[] = [Stripe, PayPal];

	if (contributionType !== 'ONE_OFF' && countryId === 'GB') {
		return [DirectDebit, ...nonRegionSpecificPaymentMethods];
	} else if (
		contributionType !== 'ONE_OFF' &&
		countryGroupId === 'EURCountries'
	) {
		return [Sepa, ...nonRegionSpecificPaymentMethods];
	}

	return nonRegionSpecificPaymentMethods;
}

function switchKeyForContributionType(
	contributionType: ContributionType,
): 'oneOffPaymentMethods' | 'recurringPaymentMethods' {
	return contributionType === 'ONE_OFF'
		? 'oneOffPaymentMethods'
		: 'recurringPaymentMethods';
}

function getValidPaymentMethods(
	contributionType: ContributionType,
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
): PaymentMethod[] {
	const switchKey = switchKeyForContributionType(contributionType);
	return getPaymentMethods(contributionType, countryId, countryGroupId).filter(
		(paymentMethod) =>
			isSwitchOn(
				`${switchKey}.${toPaymentMethodSwitchNaming(paymentMethod) ?? '-'}`,
			),
	);
}

function round(amount: number) {
	/**
	 * This rounds a `number` to the second decimal.
	 *
	 * `Number.toFixed` returns a string which is not useful for calculations
	 * and would need unnecessary type conversions
	 */
	return Math.round(amount * 1e2) / 1e2;
}

const simpleFormatAmount = (currency: Currency, amount: number): string => {
	const glyph = currency.isPaddedGlyph ? ` ${currency.glyph} ` : currency.glyph;
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

	const valueWithGlyph = currency.isSuffixGlyph
		? `${amountText}${glyph}`
		: `${glyph}${amountText}`;
	return valueWithGlyph.trim();
};

const formatAmount = (
	currency: Currency,
	spokenCurrency: SpokenCurrency,
	amount: number,
	verbose: boolean,
): string => {
	if (verbose) {
		return `${amount} ${
			amount === 1 ? spokenCurrency.singular : spokenCurrency.plural
		}`;
	}

	return simpleFormatAmount(currency, amount);
};

// ----- Exports ----- //
export { simpleFormatAmount, formatAmount, getValidPaymentMethods };
