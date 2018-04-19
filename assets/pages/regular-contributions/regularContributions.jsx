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
import * as storage from 'helpers/storage';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { routes } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';
import { parse as parseAmount } from 'helpers/contributions';
import RegularContributionsThankYouPage from './components/regularContributionsThankYouPage';
import RegularContributionsPage from './components/regularContributionsPage';
import reducer from './regularContributionsReducers';
import { setPayPalButton } from './regularContributionsActions';
import { parseContrib } from '../../helpers/contributions';
import type { PaymentMethod } from './helpers/ajax';


// ----- Page Startup ----- //
const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
const countryGroup = detectCountryGroup();
const { amount } = parseAmount(getQueryParameter('contributionValue'), contributionType, countryGroup);

function getPaymentMethod(): ?PaymentMethod {
  const pm: ?string = storage.getSession('paymentMethod');
  if (pm === 'DirectDebit' || pm === 'Stripe' || pm === 'PayPal') {
    return (pm: PaymentMethod);
  }
  return null;
}


/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = pageInit(
  reducer(amount, getPaymentMethod()),
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
        <Route exact path={routes.recurringContribCheckout} component={RegularContributionsPage} />
        <Route exact path={routes.recurringContribThankyou} component={RegularContributionsThankYouPage} />
        <Route exact path={routes.recurringContribPending} component={RegularContributionsThankYouPage} />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'regular-contributions-page');
