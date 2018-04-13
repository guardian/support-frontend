// @flow

// ----- Imports ----- //

import React from 'react';
import { applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import * as user from 'helpers/user/user';
import { getQueryParameter } from 'helpers/url';
import { parse as parseAmount } from 'helpers/contributions';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import DirectDebitContributionsThankYouPage from './components/directDebitContributionsThankYou';
import DefaultContributionsThankYouPage from './components/defaultContributionsThankYou';
import RegularContributionsPage from './components/regularContributionsPage';
import reducer from './regularContributionsReducers';
import type { PageState } from './regularContributionsReducers';

import { setPayPalButton } from './regularContributionsActions';
import { parseContrib } from '../../helpers/contributions';


// ----- Page Startup ----- //

const countryGroup = detectCountryGroup();
const country = detectCountry();
const currency = detectCurrency(countryGroup);

const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
const contributionAmount = parseAmount(getQueryParameter('contributionValue'), contributionType, countryGroup).amount;

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = pageInit(
  reducer(contributionAmount, currency),
  undefined,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

user.init(store.dispatch);
store.dispatch(setPayPalButton(window.guardian.payPalType));

const state: PageState = store.getState();


// ----- Render ----- //

const CheckoutPage = () => (
  <RegularContributionsPage
    amount={state.page.regularContrib.amount}
    currency={state.page.regularContrib.currency}
    contributionType={contributionType}
    country={country}
  />
);

const ThankYouPage = () => {
  const current: PageState = store.getState();
  if (current.page.regularContrib.paymentMethod === 'DirectDebit') {
    return (
      <DirectDebitContributionsThankYouPage
        accountHolderName={current.page.directDebit.accountHolderName}
        accountNumber={current.page.directDebit.accountNumber}
        sortCodeArray={current.page.directDebit.sortCodeArray}
      />
    );
  }
  return (<DefaultContributionsThankYouPage />);
};

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route exact path="/contribute/recurring" component={CheckoutPage} />
        <Route exact path="/contribute/recurring/thankyou" component={ThankYouPage} />
        <Route exact path="/contribute/recurring/pending" component={ThankYouPage} />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'regular-contributions-page');
