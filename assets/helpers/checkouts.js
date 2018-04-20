// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { getMinContribution, parseContribution, validateContribution } from 'helpers/contributions';
import * as storage from 'helpers/storage';
import { parseContrib } from 'helpers/contributions';


// ----- Types ----- //

export type PaymentMethod = 'DirectDebit' | 'PayPal' | 'Stripe';


// ----- Functions ----- //

function getAmount(): number {

  const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
  const countryGroup = detectCountryGroup();

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
