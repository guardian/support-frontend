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

import { getQueryParameter } from 'helpers/url';
import { parse as parseAmount } from 'helpers/contributions';
import DirectDebitContributionsThankYouPage from './components/directDebitContributionsThankYou';
import DefaultContributionsThankYouPage from './components/defaultContributionsThankYou';
import RegularContributionsPage from './components/regularContributionsPage';
import reducer from './regularContributionsReducers';
import type { PageState } from './regularContributionsReducers';
import { setPayPalButton } from './regularContributionsActions';
import { parseContrib } from '../../helpers/contributions';
import type { PaymentMethod } from './helpers/ajax';


// ----- Page Startup ----- //
const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
const countryGroup = detectCountryGroup();
const { amount } = parseAmount(getQueryParameter('contributionValue'), contributionType, countryGroup);

function getPaymentMethod(): ?PaymentMethod {
  const pm: ?string = storage.getSession('paymentMethod');
  if (pm && (pm === 'DirectDebit' || pm === 'Stripe' || pm === 'PayPal')) {
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

const state: PageState = store.getState();

// ----- Render ----- //

const ThankYouPage = () => {
  if (state.page.regularContrib.paymentMethod === 'DirectDebit') {
    return (
      <DirectDebitContributionsThankYouPage />
    );
  }
  return (<DefaultContributionsThankYouPage />);
};

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route exact path="/contribute/recurring" component={RegularContributionsPage} />
        <Route exact path="/contribute/recurring/thankyou" component={ThankYouPage} />
        <Route exact path="/contribute/recurring/pending" component={ThankYouPage} />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'regular-contributions-page');
