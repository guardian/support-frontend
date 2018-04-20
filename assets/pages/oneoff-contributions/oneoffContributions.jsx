// @flow

// ----- Imports ----- //

import React from 'react';
import { applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';


import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import * as user from 'helpers/user/user';
import { getQueryParameter } from 'helpers/url';
import { parse as parseContrib } from 'helpers/contributions';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { routes } from 'helpers/routes';

import reducer from './oneOffContributionsReducers';

import { setPayPalButton } from './oneoffContributionsActions';
import OneOffContributionsPage from './components/oneOffContributionsPages';
import RegularContributionsThankYouPage from '../regular-contributions/components/regularContributionsThankYouPage';


// ----- Page Startup ----- //

const countryGroup = detectCountryGroup();
const contributionAmount = parseContrib(getQueryParameter('contributionValue'), 'ONE_OFF', countryGroup).amount;

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = pageInit(
  reducer(contributionAmount),
  undefined,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

user.init(store.dispatch);
store.dispatch(setPayPalButton(window.guardian.payPalType));

const router = (
  /* eslint-disable max-len */
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route exact path={routes.oneOffContribCheckout} component={OneOffContributionsPage} />
        <Route exact path={routes.oneOffContribThankyou} component={RegularContributionsThankYouPage} />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'oneoff-contributions-page');
