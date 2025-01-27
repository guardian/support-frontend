// ----- Imports ----- //
import {
	generateContributionTypes,
	toContributionType,
} from 'helpers/contributions';
import type {
	ContributionType,
	ContributionTypes,
	ContributionTypeSetting,
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
import type {
	Currency,
	SpokenCurrency,
} from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage/storage';
import { getQueryParameter } from 'helpers/urls/url';

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
export {
	simpleFormatAmount,
	formatAmount,
	getValidContributionTypesFromUrlOrElse,
	getContributionTypeFromSession,
	getContributionTypeFromUrl,
	getAmountFromUrl,
	getValidPaymentMethods,
	getPaymentMethodFromSession,
};
