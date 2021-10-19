// Copied from
// https://github.com/playframework/playframework/blob/master/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L81
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
import { config } from "helpers/contributions";
import type { CountryGroup, CountryGroupId } from "helpers/internationalisation/countryGroup";
import type { ContributionType, OtherAmounts, SelectedAmounts } from "helpers/contributions";
import { Canada, UnitedStates, AUDCountries, countryGroups } from "../internationalisation/countryGroup";
import { DateUtils } from "react-day-picker";
import { daysFromNowForGift } from "pages/digital-subscription-checkout/components/helpers";
import type { LocalCurrencyCountry } from "../internationalisation/localCurrencyCountry";
import type { Option } from "helpers/types/option";
export const emailRegexPattern = '^[a-zA-Z0-9\\.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$';
export const isEmpty: (arg0: string | null) => boolean = input => typeof input === 'undefined' || input == null || input.trim().length === 0;
export const isNotEmpty: (arg0: string | null) => boolean = input => !isEmpty(input);
export const isNotTooFarInTheFuture: (arg0: Date | null) => boolean = date => {
  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate() + daysFromNowForGift);
  const dateIsInsideRange = !DateUtils.isDayAfter(date, rangeDate);
  return dateIsInsideRange;
};
export const isValidEmail: (arg0: string | null) => boolean = input => !!input && new RegExp(emailRegexPattern).test(input);
export const isValidZipCode = (zipCode: string) => /^\d{5}(-\d{4})?$/.test(zipCode);
export const isLargerOrEqual: (arg0: number, arg1: string) => boolean = (min, input) => min <= parseFloat(input);
export const isSmallerOrEqual: (arg0: number, arg1: string) => boolean = (max, input) => parseFloat(input) <= max;
export const maxTwoDecimals: (arg0: string) => boolean = input => new RegExp('^\\d+\\.?\\d{0,2}$').test(input);
export const checkFirstName: (arg0: string | null) => boolean = isNotEmpty;
export const checkLastName: (arg0: string | null) => boolean = isNotEmpty;
export const checkBillingState: (arg0: string | null) => boolean = s => typeof s === 'string' && isNotEmpty(s);
export const checkEmail: (arg0: string | null) => boolean = input => isNotEmpty(input) && isValidEmail(input);
export const emailAddressesMatch: (arg0: boolean, arg1: string, arg2: Option<string>) => boolean = (isSignedIn, email, confirmEmail) => isSignedIn || email === confirmEmail;
export const checkOptionalEmail: (arg0: string | null) => boolean = input => isEmpty(input) || isValidEmail(input);
export const checkGiftStartDate: (arg0: string | null) => boolean = rawDate => {
  const date = rawDate ? new Date(rawDate) : null;
  return isNotEmpty(rawDate) && isNotTooFarInTheFuture(date);
};
export const amountIsValid = (input: string, countryGroupId: CountryGroupId, contributionType: ContributionType, localCurrencyCountry?: LocalCurrencyCountry | null, useLocalCurrency?: boolean | null): boolean => {
  const min = useLocalCurrency && localCurrencyCountry ? localCurrencyCountry.config[contributionType].min : config[countryGroupId][contributionType].min;
  const max = useLocalCurrency && localCurrencyCountry ? localCurrencyCountry.config[contributionType].max : config[countryGroupId][contributionType].max;
  return isNotEmpty(input) && isLargerOrEqual(min, input) && isSmallerOrEqual(max, input) && maxTwoDecimals(input);
};
export const amountOrOtherAmountIsValid = (selectedAmounts: SelectedAmounts, otherAmounts: OtherAmounts, contributionType: ContributionType, countryGroupId: CountryGroupId, localCurrencyCountry?: LocalCurrencyCountry | null, useLocalCurrency?: boolean | null): boolean => {
  let amt = '';

  if (selectedAmounts[contributionType] && selectedAmounts[contributionType] === 'other') {
    if (otherAmounts[contributionType] && otherAmounts[contributionType].amount) {
      amt = otherAmounts[contributionType].amount;
    }
  } else if (selectedAmounts[contributionType]) {
    amt = selectedAmounts[contributionType].toString();
  }

  return amountIsValid(amt, countryGroupId, contributionType, localCurrencyCountry, useLocalCurrency);
};
export const checkStateIfApplicable: (arg0: string | null, arg1: CountryGroupId, arg2: ContributionType) => boolean = (billingState: string | null, countryGroupId: CountryGroupId, contributionType: ContributionType) => {
  if (contributionType !== 'ONE_OFF') {
    if (countryGroupId === UnitedStates || countryGroupId === Canada) {
      return checkBillingState(billingState);
    } else if (countryGroupId === AUDCountries) {
      // Allow no state to be selected if the user is GEO-IP'd to one of the non AU countries that use AUD.
      if (window.guardian && window.guardian.geoip) {
        const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
        const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(c => c !== 'AU');

        if (AUDCountriesWithNoStates.includes(window.guardian.geoip.countryCode)) {
          return true;
        }
      }

      return checkBillingState(billingState);
    }
  }

  return true;
};
// ignores all spaces
export const isValidIban = (iban: string | null): boolean => !!iban && /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/.test(iban.replace(/ /g, ''));