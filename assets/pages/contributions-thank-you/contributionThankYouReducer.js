// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import { marketingConsentReducerFor } from 'containerisableComponents/marketingConsent/marketingConsentReducer';
import { userReducer as user } from 'helpers/user/userReducer';
import csrfReducer from 'helpers/csrf/csrfReducer';

import type { State as MarketingConsentState } from 'containerisableComponents/marketingConsent/marketingConsentReducer';

import type { CommonState } from 'helpers/page/page';
import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';


// ----- Types ----- //

type PageState = {
  marketingConsent: MarketingConsentState,
  user: UserState,
  csrf: CsrfState,
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducer ----- //

export default combineReducers({
  marketingConsent: marketingConsentReducerFor('CONTRIBUTIONS_THANK_YOU'),
  user,
  csrf: csrfReducer,
});
