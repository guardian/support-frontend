// @flow

// ----- Imports ----- //

import { createStore, combineReducers } from 'redux';
import 'ophan';

import * as abTest from 'helpers/abTests/abtest';
import * as logger from 'helpers/logger';
import * as googleTagManager from 'helpers/tracking/googleTagManager';

import { getCampaign, getAcquisition } from 'helpers/tracking/acquisitions';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';

import type { Campaign, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abTests/abtest';

import { getAllQueryParamsWithExclusions } from 'helpers/url';
import type { Action } from './pageActions';


// ----- Types ----- //

export type CommonState = {
  campaign: ?Campaign,
  referrerAcquisitionData: ReferrerAcquisitionData,
  currency: Currency,
  otherQueryParams: Array<[string, string]>,
  countryGroup: CountryGroupId,
  country: IsoCountry,
  abParticipations: Participations,
};

export type PreloadedState = {
  campaign?: $PropertyType<CommonState, 'campaign'>,
  referrerAcquisitionData?: $PropertyType<CommonState, 'referrerAcquisitionData'>,
  country?: $PropertyType<CommonState, 'country'>,
  abParticipations?: $PropertyType<CommonState, 'abParticipations'>,
};


// ----- Functions ----- //

function doNotTrack(): boolean {
  // $FlowFixMe
  const doNotTrackFlag = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;

  return doNotTrackFlag === '1' || doNotTrackFlag === 'yes';
}

// Sets up GA and logging.
function analyticsInitialisation(participations: Participations): void {
  if (!(doNotTrack())) {
    googleTagManager.init(participations);
  }
  // Logging.
  logger.init();
}

// Creates the initial state for the common reducer.
function buildInitialState(
  abParticipations: Participations,
  preloadedState: ?PreloadedState = {},
  countryGroup: CountryGroupId,
  country: IsoCountry,
  currency: Currency,
): CommonState {
  const acquisition = getAcquisition(abParticipations);
  const excludedParameters = ['REFPVID', 'INTCMP', 'acquisitionData'];
  const otherQueryParams = getAllQueryParamsWithExclusions(excludedParameters);

  return Object.assign({}, {
    campaign: acquisition ? getCampaign(acquisition) : null,
    referrerAcquisitionData: acquisition,
    otherQueryParams,
    countryGroup,
    country,
    abParticipations,
    currency,
  }, preloadedState);

}

// Sets up the common reducer with its initial state.
function createCommonReducer(initialState: CommonState): (CommonState, Action) => CommonState {

  function commonReducer(
    state: CommonState = initialState,
    action: Action,
  ): CommonState {
    switch (action.type) {
      case 'SET_COUNTRY':
        return Object.assign({}, state, { country: action.country });
      case 'SET_COUNTRY_GROUP':
        return {
          ...state,
          countryGroup: action.countryGroup,
          currency: detectCurrency(action.countryGroup),
          country: detectCountry(action.countryGroup),
        };
      default:
        return state;
    }
  }

  return commonReducer;
}

// For pages that don't need Redux.
function statelessInit() {
  const country: IsoCountry = detectCountry();
  const participations: Participations = abTest.init(country);
  analyticsInitialisation(participations);

}

// Initialises the page.
function init(
  pageReducer: Object,
  preloadedState: ?PreloadedState = null,
  middleware: ?Function,
) {

  const countryGroup: CountryGroupId = detectCountryGroup();
  const country: IsoCountry = detectCountry();
  const currency: Currency = detectCurrency(countryGroup);
  const participations: Participations = abTest.init(country);
  analyticsInitialisation(participations);

  const initialState: CommonState = buildInitialState(
    participations,
    preloadedState,
    countryGroup,
    country,
    currency,
  );
  const commonReducer = createCommonReducer(initialState);

  return createStore(
    combineReducers({ page: pageReducer, common: commonReducer }),
    undefined,
    middleware,
  );
}


// ----- Exports ----- //

export {
  createCommonReducer,
  init,
  statelessInit,
};
