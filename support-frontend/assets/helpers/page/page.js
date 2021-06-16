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
import { renderError } from 'helpers/rendering/render';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import * as logger from 'helpers/utilities/logger';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
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
import { trackAbTests, setReferrerDataInLocalStorage } from 'helpers/tracking/ophan';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { isPostDeployUser } from 'helpers/user/user';
import { getAmounts } from 'helpers/abTests/helpers';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { localCurrencyCountries } from '../internationalisation/localCurrencyCountry';
import type { LocalCurrencyCountry } from '../internationalisation/localCurrencyCountry';

if (process.env.NODE_ENV === 'DEV') {
  // $FlowIgnore
  import('preact/debug');
}

// ----- Types ----- //

export type ReduxState<PageState> = {|
  common: CommonState,
  page: PageState,
|};


// ----- Functions ----- //

// Sets up GA and logging.
function analyticsInitialisation(participations: Participations, acquisitionData: ReferrerAcquisitionData): void {
  setReferrerDataInLocalStorage(acquisitionData);
  googleTagManager.init(participations);
  ophan.init();
  trackAbTests(participations);
  // Logging.
  logger.init();
}

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

// For pages that don't need Redux.
function statelessInit() {
  const country: IsoCountry = detectCountry();
  const countryGroupId: CountryGroupId = detectCountryGroup();
  const participations: Participations = abTest.init(country, countryGroupId, window.guardian.settings);
  const acquisitionData = getReferrerAcquisitionData();
  analyticsInitialisation(participations, acquisitionData);
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

    /**
     * Dynamically load @guardian/consent-management-platform
     * on condition we're not server side rendering (ssr) the page.
     * @guardian/consent-management-platform breaks ssr otherwise.
     */
    if (!getGlobal('ssr') && !isPostDeployUser()) {
      import('@guardian/consent-management-platform').then(({ cmp }) => {
        cmp.init({
          country: countryId,
        });
      });
    }

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
  statelessInit,
};
