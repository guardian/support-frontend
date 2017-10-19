// @flow

// ----- Imports ----- //

import { createStore, combineReducers } from 'redux';
import 'ophan';

import * as ga from 'helpers/tracking/ga';
import * as abTest from 'helpers/abtest';
import * as logger from 'helpers/logger';
import { getCampaign, getAcquisition } from 'helpers/tracking/acquisitions';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';

import type { Campaign, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abtest';
import { getQueryParams } from 'helpers/url';

import type { Action } from './pageActions';


// ----- Types ----- //

export type CommonState = {
  campaign: ?Campaign,
  referrerAcquisitionData: ReferrerAcquisitionData,
  currency: Currency,
  otherQueryParams: Array<[string, string]>,
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

// Sets up GA and logging.
function analyticsInitialisation(participations: Participations): void {

  // Google analytics.
  ga.init();
  ga.setDimension('experience', abTest.getVariantsAsString(participations));
  ga.trackPageview();

  // Logging.
  logger.init();

}

// Creates the initial state for the common reducer.
function buildInitialState(
  abParticipations: Participations,
  preloadedState: ?PreloadedState = {},
  country: IsoCountry,
  currency: Currency,
): CommonState {

  const acquisition = getAcquisition();
  const otherQueryParams = getQueryParams(['REFPVID', 'INTCMP']);

  return Object.assign({}, {
    campaign: acquisition ? getCampaign(acquisition) : null,
    referrerAcquisitionData: acquisition,
    otherQueryParams,
    country,
    abParticipations,
    currency,
  }, preloadedState);

}

// Sets up the common reducer with its initial state.
function createCommonReducer(
  initialState: CommonState): (CommonState, Action) => CommonState {

  function commonReducer(
    state: CommonState = initialState,
    action: Action): CommonState {

    switch (action.type) {

      case 'SET_COUNTRY':
        return Object.assign({}, state, { country: action.country });

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

  const country: IsoCountry = detectCountry();
  const currency: Currency = detectCurrency(country);
  const participations: Participations = abTest.init(country);
  analyticsInitialisation(participations);
  const initialState: CommonState = buildInitialState(
    participations,
    preloadedState,
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
