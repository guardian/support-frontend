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

// ----- Exports ----- //

export {
  getAmount,
  getPaymentMethod,
};
