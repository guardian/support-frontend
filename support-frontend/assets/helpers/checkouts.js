// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import {
  type ContributionType, type ContributionTypes,
  getFrequency,
  toContributionType,
  generateContributionTypes,
} from 'helpers/contributions';
import * as storage from 'helpers/storage';
import { type Switches } from 'helpers/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency, IsoCurrency, SpokenCurrency } from 'helpers/internationalisation/currency';
import { currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
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


function getValidContributionTypesFromUrlOrElse(fallback: ContributionTypes): ContributionTypes {
  const contributionTypesFromUrl = getQueryParameter('contributionTypes');
  if (contributionTypesFromUrl) {
    return generateContributionTypes(contributionTypesFromUrl
      .split(',')
      .map(toContributionType)
      .filter(Boolean)
      .map(contributionType => ({ contributionType })));
  }

  return fallback;
}

function toHumanReadableContributionType(contributionType: ContributionType): 'Single' | 'Monthly' | 'Annual' {
  switch (contributionType) {
    case 'ONE_OFF': return 'Single';
    case 'MONTHLY': return 'Monthly';
    case 'ANNUAL': return 'Annual';
    default: return 'Monthly';
  }
}

function getContributionTypeFromSession(): ?ContributionType {
  return toContributionType(storage.getSession('selectedContributionType'));
}

function getContributionTypeFromUrl(): ?ContributionType {
  return toContributionType(getQueryParameter('selectedContributionType'));
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

const formatAmount = (currency: Currency, spokenCurrency: SpokenCurrency, amount: string, verbose: boolean) => {
  const numericAmount = Number(amount);
  return (verbose ?
    `${numericAmount} ${numericAmount === 1 ? spokenCurrency.singular : spokenCurrency.plural}` :
    `${currency.glyph}${numericAmount % 1 ? numericAmount.toFixed(2) : numericAmount}`);
};


const getContributeButtonCopy = (
  contributionType: ContributionType,
  amount: number,
  currency: IsoCurrency,
) => {
  const frequency = getFrequency(contributionType);
  const amountAsString = amount.toString();

  const amountCopy = amount ?
    formatAmount(
      currencies[currency],
      spokenCurrencies[currency],
      amountAsString,
      false,
    ) : '';
  return `Contribute ${amountCopy} ${frequency}`;
};

const getContributeButtonCopyWithPaymentType = (
  contributionType: ContributionType,
  amount: number,
  currency: IsoCurrency,
  paymentMethod: PaymentMethod,
) => {
  const paymentDescriptionCopy = getPaymentDescription(contributionType, paymentMethod);
  const contributionButtonCopy = getContributeButtonCopy(contributionType, amount, currency);
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
  getValidContributionTypesFromUrlOrElse,
  getContributionTypeFromSession,
  getContributionTypeFromUrl,
  toHumanReadableContributionType,
  getValidPaymentMethods,
  getPaymentMethodToSelect,
  getPaymentMethodFromSession,
  getPaymentDescription,
  getPaymentLabel,
};
