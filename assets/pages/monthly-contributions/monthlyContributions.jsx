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

import pageStartup from 'helpers/pageStartup';
import getQueryParameter from 'helpers/url';
import PaymentMethods from './components/paymentMethods';
import NameForm from './components/nameForm';
import ContribAmount from './components/contribAmount';
import reducer from './reducers/reducers';

import { setContribAmount, setPayPalButton } from './actions/monthlyContributionsActions';

// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// Retrieves the contrib amount from the url and sends it to the redux store.
store.dispatch(setContribAmount(getQueryParameter('contributionValue', '5')));

store.dispatch(setPayPalButton(window.guardian.payPalButtonExists));


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <TestUserBanner />
      <SimpleHeader />
      <div className="monthly-contrib gu-content-margin">
        <InfoSection className="monthly-contrib__header">
          <h1 className="monthly-contrib__heading">Make a monthly contribution</h1>
          <Secure />
        </InfoSection>
        <InfoSection heading="Your monthly contribution" className="monthly-contrib__your-contrib">
          <ContribAmount />
        </InfoSection>
        <InfoSection heading="Your details" className="monthly-contrib__your-details">
          <DisplayName />
          <NameForm />
        </InfoSection>
        <InfoSection heading="Payment methods" className="monthly-contrib__payment-methods">
          <PaymentMethods />
        </InfoSection>
        <InfoSection className="monthly-contrib__payment-methods">
          <TermsPrivacy
            termsLink="https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions"
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
        </InfoSection>
      </div>
      <section className="gu-content-filler">
        <div className="gu-content-filler__inner" />
      </section>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
