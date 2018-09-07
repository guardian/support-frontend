// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { getMinContribution, parseContribution, validateContribution } from 'helpers/contributions';
import * as storage from 'helpers/storage';

import type { Contrib } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

export type PaymentMethod = 'DirectDebit' | 'PayPal' | 'Stripe';

export type RegularCheckoutCallback = (
  token?: string,
  accountNumber?: string,
  sortCode?: string,
  accountHolderName?: string
) => Promise<*>

// ----- Data ----- //

const paymentMethodsPerCountryGroup: { [CountryGroupId | 'default']: PaymentMethod[] } = {
  GBPCountries: ['Stripe', 'DirectDebit', 'PayPal'],
  default: ['Stripe', 'PayPal'],
};

// ----- Functions ----- //

function getAmount(contributionType: Contrib, countryGroup: CountryGroupId): number {

  const contributionValue = getQueryParameter('contributionValue');

  if (contributionValue !== null && contributionValue !== undefined) {
    const parsed = parseContribution(contributionValue);

    if (parsed.valid) {
      const error = validateContribution(parsed.amount, contributionType, countryGroup);

      if (!error) {
        return parsed.amount;
      }
    }
  }

  return getMinContribution(contributionType, countryGroup);

}

function getPaymentMethod(): ?PaymentMethod {
  const pm: ?string = storage.getSession('paymentMethod');
  if (pm === 'DirectDebit' || pm === 'Stripe' || pm === 'PayPal') {
    return (pm: PaymentMethod);
  }
  return null;
}

function getPaymentDescription(contributionType: Contrib, paymentMethod: PaymentMethod): string {
  if (contributionType === 'ONE_OFF') {
    if (paymentMethod === 'PayPal') {
      return 'with PayPal';
    }

    return 'with card';
  }

  return '';
}

function getPaymentLabel(paymentMethod: PaymentMethod): string {
  switch (paymentMethod) {
    case 'Stripe': 
      return 'Credit/Debit Card';
    case 'DirectDebit':
      return 'Debit Card';
    case 'PayPal':
    default:
      return 'PayPal'
  }
}

// ----- Exports ----- //

export {
  getAmount,
  getPaymentMethod,
  getPaymentDescription,
  getPaymentLabel,
  paymentMethodsPerCountryGroup,
};
