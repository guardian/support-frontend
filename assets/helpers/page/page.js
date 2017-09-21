// @flow

// ----- Imports ----- //

import { createStore, combineReducers } from 'redux';
import 'ophan';

import * as ga from 'helpers/tracking/ga';
import * as abTest from 'helpers/abtest';
import * as logger from 'helpers/logger';
import { getCampaign } from 'helpers/tracking/guTracking';
import { getQueryParameter } from 'helpers/url';
import { detect } from 'helpers/internationalisation/country';

import type { Campaign } from 'helpers/tracking/guTracking';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abtest';

import type { Action } from './pageActions';


// ----- Types ----- //

export type CommonState = {
  intCmp: ?string,
  campaign: ?Campaign,
  refpvid: ?string,
  country: IsoCountry,
  abParticipations: Participations,
};

export type PreloadedState = {
  intCmp?: $PropertyType<CommonState, 'intCmp'>,
  campaign?: $PropertyType<CommonState, 'campaign'>,
  refpvid?: $PropertyType<CommonState, 'refpvid'>,
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
  preloadedState: PreloadedState = {},
  country: IsoCountry,
) {

  const intCmp = getQueryParameter('INTCMP');

  return Object.assign({}, {
    intCmp,
    campaign: intCmp ? getCampaign(intCmp) : null,
    refpvid: getQueryParameter('REFPVID'),
    country,
    abParticipations,
  }, preloadedState);

}

// Sets up the common reducer with its initial state.
function createCommonReducer(
  initialState: CommonState): (CommonState, Action) => CommonState {

  function commonReducer(
    state: CommonState = initialState,
    action: Action): CommonState {

    switch (action.type) {

      case 'SET_INTCMP':
        return Object.assign({}, state, {
          intCmp: action.intCmp,
          campaign: getCampaign(action.intCmp),
        });

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
  const country: IsoCountry = detect();
  const participations: Participations = abTest.init(country);
  analyticsInitialisation(participations);

}

// Initialises the page.
function init(
  pageReducer: Object,
  preloadedState?: PreloadedState,
  middleware: ?Function,
) {

  const country: IsoCountry = detect();
  const participations: Participations = abTest.init(country);
  analyticsInitialisation(participations);
  const initialState: CommonState = buildInitialState(participations, preloadedState, country);
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
