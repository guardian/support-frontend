// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type { ContributionTypes } from 'helpers/contributions';
import {
  type ThirdPartyTrackingConsent,
  writeTrackingConsentCookie,
} from '../tracking/thirdPartyTrackingConsent';


// ----- Types ----- //

export type SetCountryAction = { type: 'SET_COUNTRY_INTERNATIONALISATION', country: IsoCountry };

export type Action =
  | SetCountryAction
  | { type: 'SET_EXISTING_PAYMENT_METHODS', existingPaymentMethods: ExistingPaymentMethod[] }
  | { type: 'SET_TRACKING_CONSENT', trackingConsent: ThirdPartyTrackingConsent }
  | { type: 'SET_CONTRIBUTION_TYPES', contributionTypes: ContributionTypes };


// ----- Action Creators ----- //

function setCountry(country: IsoCountry): SetCountryAction {
  return { type: 'SET_COUNTRY_INTERNATIONALISATION', country };
}

function setExistingPaymentMethods(existingPaymentMethods: ExistingPaymentMethod[]): Action {
  return { type: 'SET_EXISTING_PAYMENT_METHODS', existingPaymentMethods };
}

function setTrackingConsent(trackingConsent: ThirdPartyTrackingConsent) {
  writeTrackingConsentCookie(trackingConsent);
  return { type: 'SET_TRACKING_CONSENT', trackingConsent };
}

function setContributionTypes(contributionTypes: ContributionTypes) {
  return { type: 'SET_CONTRIBUTION_TYPES', contributionTypes };
}

// ----- Exports ----- //

export {
  setCountry,
  setExistingPaymentMethods,
  setTrackingConsent,
  setContributionTypes,
};
