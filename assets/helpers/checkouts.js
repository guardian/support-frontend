// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { type ContributionType, type PaymentMethod } from 'helpers/contributions';
import {
  getMinContribution,
  parseContribution,
  toContributionTypeOrElse,
  validateContribution,
} from 'helpers/contributions';
import * as storage from 'helpers/storage';
import { type Switches, type SwitchObject } from 'helpers/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';


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


function getAmount(contributionType: ContributionType, countryGroup: CountryGroupId): number {

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

function getValidContributionTypes(abParticipations: Participations): ContributionType[] {
  const { usContributionTypes } = abParticipations;
  const params = usContributionTypes
    ? usContributionTypes.split('_')
    : [];

  if (params.includes('no-monthly')) {
    return ['ONE_OFF', 'ANNUAL'];
  }

  return ['ONE_OFF', 'MONTHLY', 'ANNUAL'];
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
  return toContributionTypeOrElse(storage.getSession('contributionType'), fallback);
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
  const pm: ?string = storage.getSession('paymentMethod');
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
  getValidContributionTypes,
  getContributionTypeFromSessionOrElse,
  toHumanReadableContributionType,
  getValidPaymentMethods,
  getPaymentMethodToSelect,
  getPaymentMethodFromSession,
  getPaymentDescription,
  getPaymentLabel,
};
