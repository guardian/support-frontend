// @flow

// ----- Imports ----- //

import 'ophan';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  type Reducer,
  type StoreEnhancer,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import type { Store } from 'redux';

import * as abTest from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/abtest';
import type { Switches } from 'helpers/switch';
import * as logger from 'helpers/logger';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
import * as switchHelper from 'helpers/switch';
import { detect as detectCountry, type IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCurrency, type Currency } from 'helpers/internationalisation/currency';
import { getAllQueryParamsWithExclusions } from 'helpers/url';
import {
  getCampaign,
  getAcquisition,
  type Campaign,
  type ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  detect as detectCountryGroup,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';

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
  switches: Switches,
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
  switches: Switches,
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
    switches,
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
  const countryGroupId: CountryGroupId = detectCountryGroup();
  const participations: Participations = abTest.init(country, countryGroupId);
  analyticsInitialisation(participations);
}

// Enables redux devtools extension and optional redux-thunk.
/* eslint-disable no-underscore-dangle */
function storeEnhancer<S, A>(thunk: boolean): StoreEnhancer<S, A> | typeof undefined {

  if (thunk) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return composeEnhancers(applyMiddleware(thunkMiddleware));
  }

  return window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

}
/* eslint-enable no-underscore-dangle */

// Initialises the page.
function init<S, A>(
  pageReducer: Reducer<S, A> | null = null,
  thunk?: boolean = false,
  preloadedState: ?PreloadedState = null,
): Store<*, *, *> {

  const countryGroup: CountryGroupId = detectCountryGroup();
  const country: IsoCountry = detectCountry();
  const currency: Currency = detectCurrency(countryGroup);
  const participations: Participations = abTest.init(country, countryGroup);
  const switches: Switches = switchHelper.init();
  analyticsInitialisation(participations);

  const initialState: CommonState = buildInitialState(
    participations,
    preloadedState,
    countryGroup,
    country,
    currency,
    switches,
  );
  const commonReducer = createCommonReducer(initialState);

  return createStore(
    combineReducers({ page: pageReducer, common: commonReducer }),
    storeEnhancer(thunk),
  );
}


// ----- Exports ----- //

export {
  createCommonReducer,
  init,
  statelessInit,
};
