// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import InfoSection from 'components/infoSection/infoSection';
import DisplayName from 'components/displayName/displayName';
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import pageStartup from 'helpers/pageStartup';
import { forCountry as currencyForCountry } from 'helpers/internationalisation/currency';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import * as user from 'helpers/user/user';
import { getQueryParameter } from 'helpers/url';
import { parse as parseContrib } from 'helpers/contributions';

import postCheckout from './helpers/ajax';
import NameForm from './components/nameForm';
import PaymentMethodsContainer from './components/paymentMethodsContainer';
import reducer from './reducers/reducers';
import type { CombinedState } from './reducers/reducers';

import { setPayPalButton } from './actions/monthlyContributionsActions';


// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const contributionAmount = parseContrib(getQueryParameter('contributionValue'), 'RECURRING').amount;
const country = detectCountry();
const currency = currencyForCountry(country);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(reducer(contributionAmount, currency, country), {
  intCmp: getQueryParameter('INTCMP'),
}, composeEnhancers(applyMiddleware(thunkMiddleware)));

user.init(store.dispatch);
store.dispatch(setPayPalButton(window.guardian.payPalType));

const state: CombinedState = store.getState();

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content gu-content-filler">
      <TestUserBanner />
      <SimpleHeader />
      <div className="monthly-contrib gu-content-filler__inner">
        <InfoSection className="monthly-contrib__header">
          <h1 className="monthly-contrib__heading">Make a monthly contribution</h1>
          <Secure />
        </InfoSection>
        <InfoSection heading="Your monthly contribution" className="monthly-contrib__your-contrib">
          <PaymentAmount
            amount={state.monthlyContrib.amount}
            currency={state.monthlyContrib.currency}
          />
        </InfoSection>
        <InfoSection heading="Your details" className="monthly-contrib__your-details">
          <DisplayName />
          <NameForm />
        </InfoSection>
        <InfoSection heading="Payment methods" className="monthly-contrib__payment-methods">
          <PaymentMethodsContainer
            stripeCallback={postCheckout('stripeToken')}
            payPalCallback={postCheckout('baid')}
            payPalType={state.monthlyContrib.payPalType}
          />
        </InfoSection>
        <InfoSection className="monthly-contrib__payment-methods">
          <TermsPrivacy
            termsLink="https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions"
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
          <ContribLegal />
        </InfoSection>
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
