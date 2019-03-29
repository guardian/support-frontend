// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import {
  type ContributionType, getFrequency,
  toContributionType,
} from 'helpers/contributions';
import {
  toContributionTypeOrElse,
} from 'helpers/contributions';
import * as storage from 'helpers/storage';
import { type Switches } from 'helpers/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency, IsoCurrency, SpokenCurrency } from 'helpers/internationalisation/currency';
import { currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import type { Amount, SelectedAmounts } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import { ExistingCard, ExistingDirectDebit } from './paymentMethods';
import { isSwitchOn } from 'helpers/globals';


// ----- Types ----- //

export type PaymentMethodSwitch = 'directDebit' | 'payPal' | 'stripe' | 'existingCard' | 'existingDirectDebit';

type StripeHandler = { open: Function, close: Function };

export type ThirdPartyPaymentLibrary = StripeHandler;

// ----- Functions ----- //

function toPaymentMethodSwitchNaming(paymentMethod: PaymentMethod): PaymentMethodSwitch | null {
  switch (paymentMethod) {
    case PayPal: return 'payPal';
    case Stripe: return 'stripe';
    case DirectDebit: return 'directDebit';
    case ExistingCard: return 'existingCard';
    case ExistingDirectDebit: return 'existingDirectDebit';
    default: return null;
  }
}


function getValidContributionTypesFromUrlOrElse(fallback: ContributionType[]): ContributionType[] {
  const contributionTypesFromUrl = getQueryParameter('contributionTypes');
  if (contributionTypesFromUrl) {
    return contributionTypesFromUrl
      .split(',')
      .map(toContributionType)
      .filter(Boolean);
  }

  return fallback;
}

function getValidContributionTypes(countryGroupId: CountryGroupId): ContributionType[] {

  const defaultContributionTypes = ['ONE_OFF', 'MONTHLY', 'ANNUAL'];

  const mappings = {
    GBPCountries: defaultContributionTypes,
    UnitedStates: defaultContributionTypes,
    AUDCountries: defaultContributionTypes,
    EURCountries: defaultContributionTypes,
    International: defaultContributionTypes,
    NZDCountries: defaultContributionTypes,
    Canada: defaultContributionTypes,
  };
  return getValidContributionTypesFromUrlOrElse(mappings[countryGroupId]);
}

function toHumanReadableContributionType(contributionType: ContributionType): 'Single' | 'Monthly' | 'Annual' {
  switch (contributionType) {
    case 'ONE_OFF': return 'Single';
    case 'MONTHLY': return 'Monthly';
    case 'ANNUAL': return 'Annual';
    default: return 'Annual';
  }
}

function getContributionTypeFromSessionOrElse(fallback: ContributionType): ContributionType {
  return toContributionTypeOrElse(storage.getSession('selectedContributionType'), fallback);
}

function getContributionTypeFromUrlOrElse(fallback: ContributionType): ContributionType {
  return toContributionTypeOrElse(getQueryParameter('selectedContributionType', fallback), fallback);
}

// Returns an array of Payment Methods, in the order of preference,
// i.e the first element in the array will be the default option
function getPaymentMethods(contributionType: ContributionType, countryId: IsoCountry): PaymentMethod[] {
  return contributionType !== 'ONE_OFF' && countryId === 'GB'
    ? [DirectDebit, Stripe, PayPal]
    : [Stripe, PayPal];
}

function getValidPaymentMethods(
  contributionType: ContributionType,
  allSwitches: Switches,
  countryId: IsoCountry,
): PaymentMethod[] {
  const switchKey = (contributionType === 'ONE_OFF') ? 'oneOffPaymentMethods' : 'recurringPaymentMethods';
  return getPaymentMethods(contributionType, countryId)
    .filter(paymentMethod =>
      isSwitchOn(`${switchKey}.${toPaymentMethodSwitchNaming(paymentMethod) || '-'}`));
}

function getPaymentMethodToSelect(
  contributionType: ContributionType,
  allSwitches: Switches,
  countryId: IsoCountry,
) {
  const validPaymentMethods = getValidPaymentMethods(contributionType, allSwitches, countryId);
  return validPaymentMethods[0] || 'None';
}

function getPaymentMethodFromSession(): ?PaymentMethod {
  const pm: ?string = storage.getSession('selectedPaymentMethod');
  // can't use Flow types for these comparisons for some strange reason
  if (pm === 'DirectDebit' || pm === 'Stripe' || pm === 'PayPal' || pm === 'ExistingCard' || pm === 'ExistingDirectDebit') {
    return (pm: PaymentMethod);
  }
  return null;
}

function getPaymentDescription(contributionType: ContributionType, paymentMethod: PaymentMethod): string {
  if (contributionType === 'ONE_OFF') {
    if (paymentMethod === PayPal) {
      return 'with PayPal';
    }

    return 'with card';
  }

  return '';
}

const formatAmount = (currency: Currency, spokenCurrency: SpokenCurrency, amount: Amount, verbose: boolean) =>
  (verbose ?
    `${amount.value} ${amount.value === 1 ? spokenCurrency.singular : spokenCurrency.plural}` :
    `${currency.glyph}${amount.value}`);


const getContributeButtonCopy = (
  contributionType: ContributionType,
  maybeOtherAmount: string | null,
  selectedAmounts: SelectedAmounts,
  currency: IsoCurrency,
) => {
  const frequency = getFrequency(contributionType);
  const otherAmount = maybeOtherAmount ? {
    value: maybeOtherAmount,
    spoken: '',
    isDefault: false,
  } : null;
  const amount = selectedAmounts[contributionType] === 'other' ? otherAmount : selectedAmounts[contributionType];

  const amountCopy = amount ?
    formatAmount(
      currencies[currency],
      spokenCurrencies[currency],
      amount,
      false,
    ) : '';
  return `Contribute ${amountCopy} ${frequency}`;
};

const getContributeButtonCopyWithPaymentType = (
  contributionType: ContributionType,
  maybeOtherAmount: string | null,
  selectedAmounts: SelectedAmounts,
  currency: IsoCurrency,
  paymentMethod: PaymentMethod,
) => {
  const paymentDescriptionCopy = getPaymentDescription(contributionType, paymentMethod);
  const contributionButtonCopy = getContributeButtonCopy(contributionType, maybeOtherAmount, selectedAmounts, currency);
  return `${contributionButtonCopy} ${paymentDescriptionCopy}`;
};

function getPaymentLabel(paymentMethod: PaymentMethod): string {
  switch (paymentMethod) {
    case Stripe:
      return 'Credit/Debit card';
    case DirectDebit:
      return 'Direct debit';
    case PayPal:
      return PayPal;
    default:
      return 'Other Payment Method';
  }
}

// ----- Exports ----- //

export {
  getContributeButtonCopy,
  getContributeButtonCopyWithPaymentType,
  formatAmount,
  getValidContributionTypes,
  getContributionTypeFromSessionOrElse,
  getContributionTypeFromUrlOrElse,
  toHumanReadableContributionType,
  getValidPaymentMethods,
  getPaymentMethodToSelect,
  getPaymentMethodFromSession,
  getPaymentDescription,
  getPaymentLabel,
};
