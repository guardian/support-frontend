// @flow

// ----- Types ----- //

import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Campaign, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { Settings } from 'helpers/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Action } from 'helpers/page/commonActions';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { ExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type { ThirdPartyTrackingConsent } from '../tracking/thirdPartyTrackingConsent';

export type Internationalisation = {|
  currencyId: IsoCurrency,
  countryGroupId: CountryGroupId,
  countryId: IsoCountry,
|};

export type CommonState = {
  campaign: ?Campaign,
  referrerAcquisitionData: ReferrerAcquisitionData,
  otherQueryParams: Array<[string, string]>,
  abParticipations: Participations,
  settings: Settings,
  trackingConsent: ThirdPartyTrackingConsent,
  internationalisation: Internationalisation,
  existingPaymentMethods?: ExistingPaymentMethod[],
};

const getInternationalisationFromCountry = (countryId: IsoCountry, internationalisation: Internationalisation) => {
  const countryGroupId = fromCountry(countryId) || internationalisation.countryGroupId;
  const currencyId = fromCountryGroupId(countryGroupId) || internationalisation.currencyId;
  return { countryGroupId, currencyId, countryId };
};

// Sets up the common reducer with its initial state.
function createCommonReducer(initialState: CommonState): (state?: CommonState, action: Action) => CommonState {

  return function commonReducer(
    state?: CommonState = initialState,
    action: Action,
  ): CommonState {

    switch (action.type) {

      case 'SET_COUNTRY_INTERNATIONALISATION':
        return {
          ...state,
          internationalisation: {
            ...state.internationalisation,
            ...getInternationalisationFromCountry(action.country, state.internationalisation),
          },
        };

      case 'SET_EXISTING_PAYMENT_METHODS': {
        return { ...state, existingPaymentMethods: action.existingPaymentMethods };
      }

      case 'SET_TRACKING_CONSENT': {
        return { ...state, trackingConsent: action.trackingConsent };
      }

      case 'SET_CONTRIBUTION_TYPES': {
        return {
          ...state,
          settings: {
            ...state.settings,
            contributionTypes: action.contributionTypes,
          },
        };
      }

      default:
        return state;
    }

  };

}

export { createCommonReducer };
