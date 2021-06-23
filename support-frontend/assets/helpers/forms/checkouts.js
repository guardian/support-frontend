// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/urls/url';
import {
  type ContributionType, type ContributionTypes,
  getFrequency,
  toContributionType,
  generateContributionTypes,
} from 'helpers/contributions';
import * as storage from 'helpers/storage/storage';
import { type Switches } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency, IsoCurrency, SpokenCurrency } from 'helpers/internationalisation/currency';
import { currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import type { SelectedAmounts } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit, PayPal, Stripe, AmazonPay, Sepa } from 'helpers/forms/paymentMethods';
import { ExistingCard, ExistingDirectDebit } from './paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { StripePaymentMethod } from './paymentIntegrations/readerRevenueApis';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Types ----- //

export type PaymentMethodSwitch = 'directDebit' | 'sepa' | 'payPal' | 'stripe' | 'existingCard' | 'existingDirectDebit' | 'amazonPay';

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
    case AmazonPay: return 'amazonPay';
    case Sepa: return 'sepa';
    default: return null;
  }
}


function getValidContributionTypesFromUrlOrElse(fallback: ContributionTypes): ContributionTypes {
  const contributionTypesFromUrl = getQueryParameter('contribution-types');
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
  return toContributionType(getQueryParameter('selected-contribution-type'));
}

// Returns an array of Payment Methods, in the order of preference,
// i.e the first element in the array will be the default option
function getPaymentMethods(
  contributionType: ContributionType,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
): PaymentMethod[] {
  if (contributionType !== 'ONE_OFF' && countryId === 'GB') {
    return [DirectDebit, Stripe, PayPal];
  } else if (countryId === 'US') {
    // Remove this condition after we've tested in PROD
    if (contributionType === 'ONE_OFF' || getQueryParameter('amazon-pay-recurring') === 'true') {
      return [Stripe, PayPal, AmazonPay];
    }
    return [Stripe, PayPal];
  } else if (contributionType !== 'ONE_OFF' && countryGroupId === 'EURCountries' && getQueryParameter('sepa') === 'true') {
    return [Sepa, Stripe, PayPal];
  }
  return [Stripe, PayPal];

}

function switchKeyForContributionType(contributionType: ContributionType): 'oneOffPaymentMethods' | 'recurringPaymentMethods' {
  return contributionType === 'ONE_OFF' ? 'oneOffPaymentMethods' : 'recurringPaymentMethods';
}

function getValidPaymentMethods(
  contributionType: ContributionType,
  allSwitches: Switches,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
): PaymentMethod[] {
  const switchKey = switchKeyForContributionType(contributionType);

  return getPaymentMethods(contributionType, countryId, countryGroupId)
    .filter(paymentMethod =>
      isSwitchOn(`${switchKey}.${toPaymentMethodSwitchNaming(paymentMethod) || '-'}`));
}

function getPaymentMethodToSelect(
  contributionType: ContributionType,
  allSwitches: Switches,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
) {
  const validPaymentMethods = getValidPaymentMethods(contributionType, allSwitches, countryId, countryGroupId);
  return validPaymentMethods[0] || 'None';
}

function getPaymentMethodFromSession(): ?PaymentMethod {
  const pm: ?string = storage.getSession('selectedPaymentMethod');
  // can't use Flow types for these comparisons for some strange reason
  if (pm === 'DirectDebit' || pm === 'Stripe' || pm === 'PayPal' || pm === 'ExistingCard' || pm === 'ExistingDirectDebit' || pm === 'AmazonPay') {
    return (pm: PaymentMethod);
  }
  return null;
}

function getPaymentDescription(contributionType: ContributionType, paymentMethod: PaymentMethod): string {
  if (contributionType === 'ONE_OFF') {
    if (paymentMethod === PayPal) {
      return 'with PayPal';
    } else if (paymentMethod === AmazonPay) {
      return 'with Amazon Pay';
    }

    return 'with card';
  }

  return '';
}

const formatAmount = (currency: Currency, spokenCurrency: SpokenCurrency, amount: number, verbose: boolean): string => {
  const glyph = currency.isPaddedGlyph ? ` ${currency.glyph} ` : currency.glyph;

  if (verbose) {
    return `${amount} ${amount === 1 ? spokenCurrency.singular : spokenCurrency.plural}`;
  }
  const valueWithGlyph = currency.isSuffixGlyph ? `${amount}${glyph}` : `${glyph}${amount}`;
  return valueWithGlyph.trim();

};

const getContributeButtonCopy = (
  contributionType: ContributionType,
  maybeOtherAmount: string | null,
  selectedAmounts: SelectedAmounts,
  currency: IsoCurrency,
) => {
  const frequency = getFrequency(contributionType);
  const amount = selectedAmounts[contributionType] === 'other' ? parseInt(maybeOtherAmount, 10) : selectedAmounts[contributionType];

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
    case Sepa:
      return 'Direct debit (SEPA)';
    case PayPal:
      return PayPal;
    case AmazonPay:
      return 'Amazon Pay';
    default:
      return 'Other Payment Method';
  }
}

// The value of result will either be:
// . null - browser has no compatible payment method button)
// . {applePay: true} - applePay is available
// . {applePay: false} - GooglePay, Microsoft Pay and PaymentRequestApi available
function getAvailablePaymentRequestButtonPaymentMethod(
  result: Object,
  contributionType: ContributionType,
): StripePaymentMethod | null {
  const switchKey = switchKeyForContributionType(contributionType);
  if (result && result.applePay === true && isSwitchOn(`${switchKey}.stripeApplePay`)) {
    return 'StripeApplePay';
  } else if (result && result.applePay === false && isSwitchOn(`${switchKey}.stripePaymentRequestButton`)) {
    return 'StripePaymentRequestButton';
  }
  return null;
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
  getAvailablePaymentRequestButtonPaymentMethod,
};
