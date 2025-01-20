// ----- Imports ----- //
import type { CanMakePaymentResult } from '@stripe/stripe-js';
import {
	generateContributionTypes,
	getFrequency,
	toContributionType,
} from 'helpers/contributions';
import type {
	ContributionType,
	ContributionTypes,
	ContributionTypeSetting,
	SelectedAmounts,
} from 'helpers/contributions';
import 'helpers/globalsAndSwitches/settings';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	DirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type {
	Currency,
	IsoCurrency,
	SpokenCurrency,
} from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage/storage';
import { getQueryParameter } from 'helpers/urls/url';
import type { StripePaymentMethod } from './paymentIntegrations/readerRevenueApis';

// ----- Types ----- //
export type PaymentMethodSwitch = 'directDebit' | 'sepa' | 'payPal' | 'stripe';

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

		case Sepa:
			return 'sepa';

		default:
			return null;
	}
}

function getValidContributionTypesFromUrlOrElse(
	fallback: ContributionTypes,
): ContributionTypes {
	const contributionTypesFromUrl = getQueryParameter('contribution-types');

	if (contributionTypesFromUrl) {
		return generateContributionTypes(
			contributionTypesFromUrl
				.split(',')
				.map(toContributionType)
				.filter(Boolean)
				.map((contributionType) => ({
					contributionType,
				})) as ContributionTypeSetting[],
		);
	}

	return fallback;
}

function toHumanReadableContributionType(
	contributionType: ContributionType,
): 'One-time' | 'Monthly' | 'Annual' {
	switch (contributionType) {
		case 'ONE_OFF':
			return 'One-time';

		case 'MONTHLY':
			return 'Monthly';

		case 'ANNUAL':
			return 'Annual';

		default:
			return 'Monthly';
	}
}

function getContributionTypeFromSession(): ContributionType | null | undefined {
	return toContributionType(storage.getSession('selectedContributionType'));
}

function getContributionTypeFromUrl(): ContributionType | null | undefined {
	return toContributionType(getQueryParameter('selected-contribution-type'));
}

function getAmountFromUrl(): number | 'other' | null {
	const selected = getQueryParameter('selected-amount');

	if (selected === 'other') {
		return 'other';
	}

	const amount = parseInt(selected, 10);

	if (!Number.isNaN(amount)) {
		return amount;
	}

	return null;
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

function getPaymentMethodFromSession(): PaymentMethod | null | undefined {
	const pm: string | null | undefined = storage.getSession(
		'selectedPaymentMethod',
	);
	const paymentMethodNames = ['DirectDebit', 'Stripe', 'PayPal'];

	if (pm && paymentMethodNames.includes(pm)) {
		return pm as PaymentMethod;
	}

	return null;
}

function getPaymentDescription(
	contributionType: ContributionType,
	paymentMethod: PaymentMethod,
): string {
	if (contributionType === 'ONE_OFF') {
		if (paymentMethod === PayPal) {
			return 'with PayPal';
		}

		return 'with card';
	}

	return '';
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

const getContributeButtonCopy = (
	contributionType: ContributionType,
	maybeOtherAmount: string | null,
	selectedAmounts: SelectedAmounts,
	currency: IsoCurrency,
): string => {
	const frequency = getFrequency(contributionType);
	const amount =
		selectedAmounts[contributionType] === 'other'
			? parseFloat(maybeOtherAmount as string)
			: selectedAmounts[contributionType];

	const amountCopy = amount
		? formatAmount(
				currencies[currency],
				spokenCurrencies[currency],
				amount as number,
				false,
		  )
		: '';

	return `Contribute ${amountCopy} ${frequency}`;
};

const getContributeButtonCopyWithPaymentType = (
	contributionType: ContributionType,
	maybeOtherAmount: string | null,
	selectedAmounts: SelectedAmounts,
	currency: IsoCurrency,
	paymentMethod: PaymentMethod,
): string => {
	const paymentDescriptionCopy = getPaymentDescription(
		contributionType,
		paymentMethod,
	);
	const contributionButtonCopy = getContributeButtonCopy(
		contributionType,
		maybeOtherAmount,
		selectedAmounts,
		currency,
	);
	return `${contributionButtonCopy} ${paymentDescriptionCopy}`;
};

function getPaymentLabel(paymentMethod: PaymentMethod): string {
	switch (paymentMethod) {
		case Stripe:
			return 'Credit/Debit card';

		case DirectDebit:
			return 'Direct debit';

		case Sepa:
			return 'Direct debit (SEPA)';

		case PayPal:
			return PayPal;

		default:
			return 'Other Payment Method';
	}
}

// The value of result will either be:
// . null - browser has no compatible payment method button)
// . {applePay: true} - applePay is available
// . {applePay: false} - GooglePay, Microsoft Pay and PaymentRequestApi available
function getAvailablePaymentRequestButtonPaymentMethod(
	result: CanMakePaymentResult | null,
	contributionType: ContributionType,
): StripePaymentMethod | null {
	const switchKey = switchKeyForContributionType(contributionType);

	if (result?.applePay && isSwitchOn(`${switchKey}.stripeApplePay`)) {
		return 'StripeApplePay';
	} else if (
		result &&
		!result.applePay &&
		isSwitchOn(`${switchKey}.stripePaymentRequestButton`)
	) {
		return 'StripePaymentRequestButton';
	}

	return null;
}

// ----- Exports ----- //
export {
	getContributeButtonCopy,
	getContributeButtonCopyWithPaymentType,
	simpleFormatAmount,
	formatAmount,
	getValidContributionTypesFromUrlOrElse,
	getContributionTypeFromSession,
	getContributionTypeFromUrl,
	getAmountFromUrl,
	toHumanReadableContributionType,
	getValidPaymentMethods,
	getPaymentMethodFromSession,
	getPaymentDescription,
	getPaymentLabel,
	getAvailablePaymentRequestButtonPaymentMethod,
};
