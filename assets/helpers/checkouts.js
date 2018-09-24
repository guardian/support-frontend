// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { getMinContribution, parseContribution, validateContribution } from 'helpers/contributions';
import * as storage from 'helpers/storage';

import type { Contrib } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

export type PaymentMethod = 'DirectDebit' | 'PayPal' | 'Stripe';

type StripeHandler = { open: Function, close: Function };

export type PaymentHandler = StripeHandler;

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
  getAmount,
  getPaymentMethod,
  getPaymentDescription,
  getPaymentLabel,
};
