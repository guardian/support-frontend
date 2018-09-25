// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { getMinContribution, parseContribution, validateContribution } from 'helpers/contributions';
import * as storage from 'helpers/storage';
import type { Switches } from 'helpers/settings'
import type { Contrib } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

export type PaymentMethod = 'DirectDebit' | 'PayPal' | 'Stripe';

export type PaymentMethodSwitchNaming = 'directDebit' | 'payPal' | 'stripe';

type StripeHandler = { open: Function, close: Function };

export type PaymentHandler = StripeHandler;

// ----- Functions ----- //

function toPaymentMethodSwitchNaming(paymentMethod: PaymentMethod): PaymentMethodSwitchNaming | null {
  switch (paymentMethod) {
    case 'PayPal': return 'payPal';
    case 'Stripe': return 'stripe';
    case 'DirectDebit': return 'directDebit';
  }
  return null;
}


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


function paymentMethodsForCountryAndContributionType(contributionType: Contrib, countryId: IsoCountry): PaymentMethod[] {
  return contributionType !== 'ONE_OFF' && countryId === 'GB'
    ? ['DirectDebit', 'Stripe', 'PayPal']
    : ['Stripe', 'PayPal'];
}

function getValidPaymentMethods(contributionType: Contrib, switches: Switches, countryId: IsoCountry): Array<PaymentMethod> {
  const switchNames = (contributionType === "ONE_OFF") ? switches.oneOffPaymentMethods : switches.recurringPaymentMethods;
  return paymentMethodsForCountryAndContributionType(contributionType, countryId).filter(x => {
    const switchName = toPaymentMethodSwitchNaming(x);
    return switchName && switchNames[switchName] === 'On';
  });
}

function getPaymentMethodFromSession(): ?PaymentMethod {
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
  paymentMethodsForCountryAndContributionType,
  getValidPaymentMethods,
  getPaymentMethodFromSession,
  getPaymentDescription,
  getPaymentLabel,
};
