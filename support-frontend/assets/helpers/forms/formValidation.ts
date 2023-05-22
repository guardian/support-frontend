import { DateUtils } from 'react-day-picker';
import { config, getConfigAbTestMin } from 'helpers/contributions';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { isUserInAbVariant } from 'helpers/redux/commonState/selectors';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { LocalCurrencyCountry } from '../internationalisation/localCurrencyCountry';

const daysFromNowForGift = 89;

// Copied from
// https://github.com/playframework/playframework/blob/master/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L81
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
export const emailRegexPattern =
	"^[a-zA-Z0-9\\.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$";

export const isEmpty: (arg0?: string | null) => boolean = (input) =>
	typeof input === 'undefined' || input == null || input.trim().length === 0;

export const isNotEmpty: (arg0?: string | null) => boolean = (input) =>
	!isEmpty(input);

export const isNotTooFarInTheFuture: (arg0: Date) => boolean = (date) => {
	const rangeDate = new Date();
	rangeDate.setDate(rangeDate.getDate() + daysFromNowForGift);

	const dateIsInsideRange = !DateUtils.isDayAfter(date, rangeDate);
	return dateIsInsideRange;
};

export const isValidEmail: (arg0: string | null) => boolean = (input) =>
	!!input && new RegExp(emailRegexPattern).test(input);

export const isValidZipCode = (zipCode: string): boolean =>
	/^\d{5}(-\d{4})?$/.test(zipCode);

export const isNotNaN = (value: string): boolean => !isNaN(parseFloat(value));

export const isLargerOrEqual: (arg0: number, arg1: string) => boolean = (
	min,
	input,
) => min <= parseFloat(input);

export const isSmallerOrEqual: (arg0: number, arg1: string) => boolean = (
	max,
	input,
) => parseFloat(input) <= max;

export const maxTwoDecimals: (arg0: string) => boolean = (input) =>
	new RegExp('^\\d+\\.?\\d{0,2}$').test(input);

export const containsEmoji: (input: string | null) => boolean = (input) =>
	/[\u{10000}-\u{10FFFF}]/u.test(input ?? '');

export const notLongerThan = (
	value: string | null,
	maxLength: number,
): boolean => {
	if (!value) return true;
	return value.length < maxLength;
};

export const checkFirstName: (firstName: string | null) => boolean = (
	firstName,
) =>
	isNotEmpty(firstName) &&
	!containsEmoji(firstName) &&
	notLongerThan(firstName, 40);

export const checkLastName: (lastName: string | null) => boolean = (lastName) =>
	isNotEmpty(lastName) &&
	!containsEmoji(lastName) &&
	notLongerThan(lastName, 40);

export const checkBillingState: (arg0: string | null) => boolean = (s) =>
	typeof s === 'string' && isNotEmpty(s);

export const checkEmail: (arg0: string | null) => boolean = (input) =>
	isNotEmpty(input) && isValidEmail(input) && notLongerThan(input, 80);

export const emailAddressesMatch: (
	isSignedIn: boolean,
	email: string,
	confirmEmail?: string,
) => boolean = (isSignedIn, email, confirmEmail) =>
	isSignedIn || email === confirmEmail;

export const checkOptionalEmail: (arg0: string | null) => boolean = (input) =>
	isEmpty(input) || isValidEmail(input);

export const checkGiftStartDate: (giftDeliveryDate?: string) => boolean = (
	rawDate,
) => {
	const date = rawDate ? new Date(rawDate) : null;

	if (isNotEmpty(rawDate) && date) {
		return isNotTooFarInTheFuture(date);
	}
	return false;
};

export const amountIsValid = (
	input: string,
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	localCurrencyCountry?: LocalCurrencyCountry | null,
	useLocalCurrency?: boolean | null,
): boolean => {
	const nudgeMinAmountsVariantA = useContributionsSelector(
		isUserInAbVariant('nudgeMinAmountsTest', 'variantA'),
	);
	const nudgeMinAmountsVariantB = useContributionsSelector(
		isUserInAbVariant('nudgeMinAmountsTest', 'variantB'),
	);
	const min =
		useLocalCurrency && localCurrencyCountry && contributionType === 'ONE_OFF'
			? localCurrencyCountry.config[contributionType].min
			: getConfigAbTestMin(
					countryGroupId,
					contributionType,
					nudgeMinAmountsVariantA,
					nudgeMinAmountsVariantB,
			  );
	const max =
		useLocalCurrency && localCurrencyCountry && contributionType === 'ONE_OFF'
			? localCurrencyCountry.config[contributionType].max
			: config[countryGroupId][contributionType].max;
	return (
		isNotEmpty(input) &&
		isNotNaN(input) &&
		isLargerOrEqual(min, input) &&
		isSmallerOrEqual(max, input) &&
		maxTwoDecimals(input)
	);
};

export const amountOrOtherAmountIsValid = (
	selectedAmounts: SelectedAmounts,
	otherAmounts: OtherAmounts,
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
	localCurrencyCountry?: LocalCurrencyCountry | null,
	useLocalCurrency?: boolean | null,
): boolean => {
	let amt = '';

	if (
		selectedAmounts[contributionType] &&
		selectedAmounts[contributionType] === 'other'
	) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- otherAmounts[contributionType] may be undefined
		if (otherAmounts[contributionType]?.amount) {
			if (typeof otherAmounts[contributionType].amount === 'string') {
				amt = otherAmounts[contributionType].amount as string;
			}
		}
	} else if (selectedAmounts[contributionType]) {
		amt = selectedAmounts[contributionType].toString();
	}

	return amountIsValid(
		amt,
		countryGroupId,
		contributionType,
		localCurrencyCountry,
		useLocalCurrency,
	);
};
// ignores all spaces
export const isValidIban = (iban?: string): boolean =>
	!!iban &&
	/[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/.test(
		iban.replace(/ /g, ''),
	);
