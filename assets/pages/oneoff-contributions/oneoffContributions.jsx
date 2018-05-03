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
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { routes } from 'helpers/routes';
import { getAmount } from 'helpers/checkouts';

import ContributionsThankYouPageContainer from './components/contributionsThankYouPageContainer';
import reducer from './oneOffContributionsReducers';
import OneOffContributionsPage from './components/oneOffContributionsPage';


// ----- Page Startup ----- //

const countryGroup = detectCountryGroup();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = pageInit(
  reducer(getAmount('ONE_OFF', countryGroup)),
  undefined,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

user.init(store.dispatch);

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route exact path={routes.oneOffContribCheckout} component={OneOffContributionsPage} />
        <Route exact path={routes.oneOffContribThankyou} component={ContributionsThankYouPageContainer} />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'oneoff-contributions-page');
