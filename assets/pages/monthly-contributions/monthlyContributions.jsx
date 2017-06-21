// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import CheckoutSection from 'components/checkoutSection/checkoutSection';
import DisplayName from 'components/displayName/displayName';
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/termsPrivacy/termsPrivacy';

import pageStartup from 'helpers/pageStartup';
import getQueryParameter from 'helpers/url';
import PaymentMethods from './components/paymentMethods';
import NameForm from './components/nameForm';
import ContribAmount from './components/contribAmount';
import reducer from './reducers/reducers';

import { setContribAmount } from './actions/monthlyContributionsActions';

// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// Retrieves the contrib amount from the url and sends it to the redux store.
store.dispatch(setContribAmount(getQueryParameter('contributionValue', '5')));


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <div className="monthly-contrib gu-content-margin">
        <CheckoutSection className="monthly-contrib__header">
          <h1 className="monthly-contrib__heading">Make a monthly contribution</h1>
          <Secure />
        </CheckoutSection>
        <CheckoutSection heading="Your monthly contribution" className="monthly-contrib__your-contrib">
          <ContribAmount />
        </CheckoutSection>
        <CheckoutSection heading="Your details" className="monthly-contrib__your-details">
          <DisplayName />
          <NameForm />
        </CheckoutSection>
        <CheckoutSection heading="Payment methods" className="monthly-contrib__payment-methods">
          <PaymentMethods />
        </CheckoutSection>
        <CheckoutSection className="monthly-contrib__payment-methods">
          <TermsPrivacy
            termsLink="https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions"
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
        </CheckoutSection>
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
