// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import InfoSection from 'components/infoSection/infoSection';
import DisplayName from 'components/displayName/displayName';
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import PaymentMethods from 'components/paymentMethods/paymentMethods';

import pageStartup from 'helpers/pageStartup';
import * as user from 'helpers/user/user';
import getQueryParameter from 'helpers/url';

import postCheckout from './helpers/ajax';
import NameForm from './components/nameForm';
import reducer from './reducers/reducers';

import { setContribAmount, setPayPalButton } from './actions/monthlyContributionsActions';


// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// Retrieves the contrib amount from the url and sends it to the redux store.
store.dispatch(setContribAmount(getQueryParameter('contributionValue', '5')));

user.init(store.dispatch);
store.dispatch(setPayPalButton(window.guardian.payPalButtonExists));

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
          <PaymentAmount amount={store.getState().monthlyContrib.amount} />
        </InfoSection>
        <InfoSection heading="Your details" className="monthly-contrib__your-details">
          <DisplayName />
          <NameForm />
        </InfoSection>
        <InfoSection heading="Payment methods" className="monthly-contrib__payment-methods">
          <PaymentMethods
            stripeCallback={postCheckout('stripeToken')}
            paypalCallback={postCheckout('baid')}
            payPalButtonExists={store.getState().monthlyContrib.payPalButtonExists}
            error={store.getState().monthlyContrib.error}
          />
        </InfoSection>
        <InfoSection className="monthly-contrib__payment-methods">
          <TermsPrivacy
            termsLink="https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions"
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
        </InfoSection>
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
