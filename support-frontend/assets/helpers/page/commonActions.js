// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { OptimizeExperiment } from 'helpers/optimize/optimize';
import type { ExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import {
  type ThirdPartyTrackingConsent,
  writeTrackingConsentCookie,
} from '../tracking/thirdPartyTrackingConsent';


// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', country: IsoCountry }
  | { type: 'SET_OPTIMIZE_EXPERIMENT_VARIANT', experiment: OptimizeExperiment }
  | { type: 'SET_EXISTING_PAYMENT_METHODS', existingPaymentMethods: ExistingPaymentMethod[] }
  | { type: 'SET_TRACKING_CONSENT', trackingConsent: ThirdPartyTrackingConsent };


// ----- Action Creators ----- //

function setCountry(country: IsoCountry): Action {
  return { type: 'SET_COUNTRY', country };
}

function setExperimentVariant(experiment: OptimizeExperiment): Action {
  return { type: 'SET_OPTIMIZE_EXPERIMENT_VARIANT', experiment };
}

function setExistingPaymentMethods(existingPaymentMethods: ExistingPaymentMethod[]): Action {
  return { type: 'SET_EXISTING_PAYMENT_METHODS', existingPaymentMethods };
}

function setTrackingConsent(trackingConsent: ThirdPartyTrackingConsent) {
  writeTrackingConsentCookie(trackingConsent);
  return { type: 'SET_TRACKING_CONSENT', trackingConsent };
}

// ----- Exports ----- //

export {
  setCountry,
  setExperimentVariant,
  setExistingPaymentMethods,
  setTrackingConsent,
};
