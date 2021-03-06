// @flow

// ----- Imports ----- //

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
import { renderError } from 'helpers/rendering/render';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';
import {
  detect as detectCurrency,
  type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { getAllQueryParamsWithExclusions, getQueryParameter } from 'helpers/urls/url';
import type { CommonState, Internationalisation } from 'helpers/page/commonReducer';
import { createCommonReducer } from 'helpers/page/commonReducer';
import {
  getCampaign,
  getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  type CountryGroupId,
  detect as detectCountryGroup,
} from 'helpers/internationalisation/countryGroup';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { getAmounts } from 'helpers/abTests/helpers';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { localCurrencyCountries } from '../internationalisation/localCurrencyCountry';
import type { LocalCurrencyCountry } from '../internationalisation/localCurrencyCountry';
import { analyticsInitialisation, consentInitialisation } from 'helpers/page/analyticsAndConsent';

// ----- Types ----- //

export type ReduxState<PageState> = {|
  common: CommonState,
  page: PageState,
|};


// ----- Functions ----- //

function getLocalCurrencyCountry(
  countryId: IsoCountry,
  abParticipations: Participations,
): ?LocalCurrencyCountry {
  const queryParam = getQueryParameter('local-currency-country');
  if (queryParam) {
    return localCurrencyCountries[queryParam.toUpperCase()];
  }

  if (abParticipations.localCurrencyTestV2 === 'variant') {
    return localCurrencyCountries[countryId];
  }

  return null;
}

// Creates the initial state for the common reducer.
function buildInitialState(
  abParticipations: Participations,
  countryGroupId: CountryGroupId,
  countryId: IsoCountry,
  currencyId: IsoCurrency,
  settings: Settings,
  acquisitionData: ReferrerAcquisitionData,
): CommonState {
  const excludedParameters = ['REFPVID', 'INTCMP', 'acquisitionData'];
  const otherQueryParams = getAllQueryParamsWithExclusions(excludedParameters);
  const localCurrencyCountry = getLocalCurrencyCountry(countryId, abParticipations);

  const internationalisation: Internationalisation = {
    countryGroupId,
    countryId,
    currencyId,
    useLocalCurrency: false,
    defaultCurrency: currencyId,
  };

  if (localCurrencyCountry) {
    internationalisation.localCurrencyCountry = localCurrencyCountry;
  }

  const amounts = getAmounts(settings, abParticipations, countryGroupId);

  return {
    campaign: acquisitionData ? getCampaign(acquisitionData) : null,
    referrerAcquisitionData: acquisitionData,
    otherQueryParams,
    internationalisation,
    abParticipations,
    settings,
    amounts,
    defaultAmounts: amounts,
  };

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
    const countryId: IsoCountry = detectCountry();
    consentInitialisation(countryId);

    const acquisitionData = getReferrerAcquisitionData();

    const settings = getSettings();
    const countryGroupId: CountryGroupId = detectCountryGroup();
    const currencyId: IsoCurrency = detectCurrency(countryGroupId);
    const participations: Participations = abTest.init(countryId, countryGroupId, settings);
    analyticsInitialisation(participations, acquisitionData);

    const initialState: CommonState = buildInitialState(
      participations,
      countryGroupId,
      countryId,
      currencyId,
      settings,
      acquisitionData,
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
};
