// @flow

// ----- Imports ----- //

import * as ophan from 'ophan';
import type { Store } from 'redux';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  type Reducer,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { renderError } from 'helpers/render';
import { overrideAmountsForParticipations } from 'helpers/abTests/helpers';
import type { Settings } from 'helpers/settings';
import * as logger from 'helpers/logger';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';
import {
  detect as detectCurrency,
  type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { getAllQueryParamsWithExclusions } from 'helpers/url';
import type { CommonState } from 'helpers/page/commonReducer';
import { createCommonReducer } from 'helpers/page/commonReducer';
import {
  getCampaign,
  getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  type CountryGroupId,
  detect as detectCountryGroup,
} from 'helpers/internationalisation/countryGroup';
import storeReferrer from 'helpers/tracking/awin';
import { trackAbTests } from 'helpers/tracking/ophan';
import { getTrackingConsent } from '../tracking/thirdPartyTrackingConsent';
import { getSettings } from 'helpers/globals';
import { doNotTrack } from 'helpers/tracking/doNotTrack';

if (process.env.NODE_ENV === 'DEV') {
  import('preact/devtools');
}

// ----- Types ----- //

export type ReduxState<PageState> = {|
  common: CommonState,
  page: PageState,
|};


// ----- Functions ----- //

// Sets up GA and logging.
function analyticsInitialisation(participations: Participations): void {
  if (!(doNotTrack())) {
    googleTagManager.init(participations);
    storeReferrer();
    ophan.init();
    trackAbTests(participations);
  }
  // Logging.
  logger.init();
}

// Creates the initial state for the common reducer.
function buildInitialState(
  abParticipations: Participations,
  countryGroupId: CountryGroupId,
  countryId: IsoCountry,
  currencyId: IsoCurrency,
  settings: Settings,
): CommonState {
  const acquisition = getReferrerAcquisitionData();
  const excludedParameters = ['REFPVID', 'INTCMP', 'acquisitionData'];
  const otherQueryParams = getAllQueryParamsWithExclusions(excludedParameters);
  const internationalisation = {
    countryGroupId,
    countryId,
    currencyId,
  };

  // Override the default amounts config with any test participations
  const amountsWithParticipationOverrides = settings.amounts ?
    overrideAmountsForParticipations(abParticipations, settings.amounts) : settings.amounts;

  const trackingConsent = getTrackingConsent();

  return {
    campaign: acquisition ? getCampaign(acquisition) : null,
    referrerAcquisitionData: acquisition,
    otherQueryParams,
    internationalisation,
    abParticipations,
    settings: { ...settings, amounts: amountsWithParticipationOverrides },
    trackingConsent,
  };

}

// For pages that don't need Redux.
function statelessInit() {
  const country: IsoCountry = detectCountry();
  const countryGroupId: CountryGroupId = detectCountryGroup();
  const participations: Participations = abTest.init(country, countryGroupId, window.guardian.settings);
  analyticsInitialisation(participations);
}

// Enables redux devtools extension and optional redux-thunk.
/* eslint-disable no-underscore-dangle */
function storeEnhancer(thunk: boolean) {

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
  pageReducer?: CommonState => Reducer<S, A> | null,
  thunk?: boolean = false,
): Store<*, *, *> {

  try {
    const settings = getSettings();
    const countryGroupId: CountryGroupId = detectCountryGroup();
    const countryId: IsoCountry = detectCountry();
    const currencyId: IsoCurrency = detectCurrency(countryGroupId);
    const participations: Participations = abTest.init(countryId, countryGroupId, settings);
    analyticsInitialisation(participations);

    const initialState: CommonState = buildInitialState(
      participations,
      countryGroupId,
      countryId,
      currencyId,
      settings,
    );
    const commonReducer = createCommonReducer(initialState);

    const store = createStore(
      combineReducers({ page: pageReducer ? pageReducer(initialState) : null, common: commonReducer }),
      storeEnhancer(thunk),
    );

    return store;
  } catch (err) {
    renderError(err, null);
    throw (err);
  }
}


// ----- Exports ----- //

export {
  init,
  statelessInit,
  doNotTrack,
};
