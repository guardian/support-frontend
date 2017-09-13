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

type CommonState = {
  intCmp: ?string,
  campaign: ?Campaign,
  refpvid: ?string,
  country: IsoCountry,
  abParticipations: Participations,
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
function buildInitialState(abParticipations: Participations) {

  const intCmp = getQueryParameter('INTCMP');

  const initialState: CommonState = {
    intCmp,
    campaign: intCmp ? getCampaign(intCmp) : null,
    refpvid: getQueryParameter('REFPVID'),
    country: detect(),
    abParticipations,
  };

  return initialState;

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

// Initialises the page.
function init(pageReducer: Object, preloadedState: ?Object, middleware: ?Function) {

  const participations: Participations = abTest.init();
  analyticsInitialisation(participations);
  const initialState: CommonState = buildInitialState(participations);
  const commonReducer = createCommonReducer(initialState);

  return createStore(
    combineReducers({ page: pageReducer, common: commonReducer }),
    preloadedState,
    middleware,
  );

}


// ----- Exports ----- //

export {
  createCommonReducer,
  init,
};
