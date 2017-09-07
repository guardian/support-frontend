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

type PageState = {
  intCmp: ?string,
  campaign: ?Campaign,
  refpvid: ?string,
  country: IsoCountry,
  abParticipations: Participations,
};


// ----- Functions ----- //

function pageInitialisation() {

  // AB tests.
  const participations = abTest.init();

  // Google analytics.
  ga.init();
  ga.setDimension('experience', abTest.getVariantsAsString(participations));
  ga.trackPageview();

  // Logging.
  logger.init();

  return participations;

}

function createPageReducer(abParticipations: Participations) {

  const intCmp = getQueryParameter('INTCMP');

  const initialState: PageState = {
    intCmp,
    campaign: intCmp ? getCampaign(intCmp) : null,
    refpvid: getQueryParameter('REFPVID'),
    country: detect(),
    abParticipations,
  };

  function pageReducer(
    state: PageState = initialState,
    action: Action): PageState {

    switch (action.type) {

      case 'SET_INTCMP':
        return Object.assign({}, state, { intCmp: action.intCmp });

      case 'SET_COUNTRY':
        return Object.assign({}, state, { country: action.country });

      default:
        return state;

    }

  }

  return pageReducer;

}

function init(reducers: Object, preloadedState: ?Object, middleware: ?Function) {

  const abParticipations = pageInitialisation();
  const pageReducer = createPageReducer(abParticipations);

  return createStore(
    combineReducers(Object.assign(reducers, { page: pageReducer })),
    preloadedState,
    middleware,
  );

}


// ----- Exports ----- //

export {
  init,
};
