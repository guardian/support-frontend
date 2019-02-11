// @flow

// Copied from
// https://github.com/playframework/playframework/blob/master/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L81
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
import { config } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';

export const emailRegexPattern = '^[a-zA-Z0-9\\.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$';

export const isNotEmpty: (string | null) => boolean = input => !!input && input.trim() !== '';
export const isValidEmail: (string | null) => boolean = input => !!input && new RegExp(emailRegexPattern).test(input);
export const isLargerOrEqual: (number, string) => boolean = (min, input) => min <= parseFloat(input);
export const isSmallerOrEqual: (number, string) => boolean = (max, input) => parseFloat(input) <= max;
export const maxTwoDecimals: string => boolean = input => new RegExp('^\\d+\\.?\\d{0,2}$').test(input);

export const checkFirstName: (string | null) => boolean = isNotEmpty;
export const checkLastName: (string | null) => boolean = isNotEmpty;
export const checkState: (string | null) => boolean = s => typeof s === 'string' && isNotEmpty(s);
export const checkEmail: (string | null) => boolean = input => isNotEmpty(input) && isValidEmail(input);


export const checkAmount: (string, CountryGroupId, ContributionType) =>
  boolean = (input: string, countryGroupId: CountryGroupId, contributionType: ContributionType) =>
    isNotEmpty(input)
    && isLargerOrEqual(config[countryGroupId][contributionType].min, input)
    && isSmallerOrEqual(config[countryGroupId][contributionType].max, input)
    && maxTwoDecimals(input);


export const checkAmountOrOtherAmount: (SelectedAmounts, OtherAmounts, ContributionType, CountryGroupId) => boolean = (
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
) => {
  const amount = selectedAmounts[contributionType] === 'other'
    ? otherAmounts[contributionType].amount || ''
    : selectedAmounts[contributionType].value || '';
  return checkAmount(amount, countryGroupId, contributionType);
};

export const checkStateIfApplicable: ((string | null), CountryGroupId) => boolean = (
  state: (string | null),
  countryGroupId: CountryGroupId,
) => {
  if (countryGroupId === 'UnitedStates' || countryGroupId === 'Canada') {
    return checkState(state);
  }
  return true;
};
