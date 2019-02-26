// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import {
  type ContributionType, getFrequency,
  type PaymentMethod,
  toContributionType,
} from 'helpers/contributions';
import {
  toContributionTypeOrElse,
} from 'helpers/contributions';
import * as storage from 'helpers/storage';
import { type Switches, type SwitchObject } from 'helpers/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency, IsoCurrency, SpokenCurrency } from 'helpers/internationalisation/currency';
import { currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import type { Amount, SelectedAmounts } from 'helpers/contributions';
import type { FrequencyTabsTestVariant } from 'helpers/abTests/abtestDefinitions';


// ----- Types ----- //

export type PaymentMethodSwitch = 'directDebit' | 'payPal' | 'stripe';

type StripeHandler = { open: Function, close: Function };

export type ThirdPartyPaymentLibrary = StripeHandler;

// ----- Functions ----- //

function toPaymentMethodSwitchNaming(paymentMethod: PaymentMethod): PaymentMethodSwitch | null {
  switch (paymentMethod) {
    case 'PayPal': return 'payPal';
    case 'Stripe': return 'stripe';
    case 'DirectDebit': return 'directDebit';
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

function getValidContributionTypes(frequencyTabsOrdering: FrequencyTabsTestVariant): ContributionType[] {
  const mappings = {
    control: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
    mas: ['MONTHLY', 'ANNUAL', 'ONE_OFF'],
    sam: ['ONE_OFF', 'ANNUAL', 'MONTHLY'],
  };
  return getValidContributionTypesFromUrlOrElse(mappings[frequencyTabsOrdering]);
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
    ? ['DirectDebit', 'Stripe', 'PayPal']
    : ['Stripe', 'PayPal'];
}

const switchIsOn =
  (switches: SwitchObject, switchName: PaymentMethodSwitch | null) =>
    switchName && switches[switchName] && switches[switchName] === 'On';

function getValidPaymentMethods(
  contributionType: ContributionType,
  allSwitches: Switches,
  countryId: IsoCountry,
): PaymentMethod[] {
  const switches = (contributionType === 'ONE_OFF') ? allSwitches.oneOffPaymentMethods : allSwitches.recurringPaymentMethods;
  return getPaymentMethods(contributionType, countryId)
    .filter(paymentMethod => switchIsOn(switches, toPaymentMethodSwitchNaming(paymentMethod)));
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
  if (pm === 'DirectDebit' || pm === 'Stripe' || pm === 'PayPal') {
    return (pm: PaymentMethod);
  }
  return null;
}

function getPaymentDescription(contributionType: ContributionType, paymentMethod: PaymentMethod): string {
  if (contributionType === 'ONE_OFF') {
    if (paymentMethod === 'PayPal') {
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
    case 'Stripe':
      return 'Credit/Debit card';
    case 'DirectDebit':
      return 'Direct debit';
    case 'PayPal':
    default:
      return 'PayPal';
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
