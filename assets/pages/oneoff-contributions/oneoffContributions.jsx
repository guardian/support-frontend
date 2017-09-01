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
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import pageStartup from 'helpers/pageStartup';
import { forCountry as currencyForCountry } from 'helpers/internationalisation/currency';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { termsLinks } from 'helpers/internationalisation/legal';
import * as user from 'helpers/user/user';
import { getQueryParameter } from 'helpers/url';
import { parse as parseContrib } from 'helpers/contributions';

import PaymentMethodsContainer from './components/paymentMethodsContainer';
import FormFields from './components/formFields';
import reducer from './reducers/reducers';
import type { CombinedState } from './reducers/reducers';
import postCheckout from './helpers/ajax';

import { setPayPalButton } from './actions/oneoffContributionsActions';

// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const contributionAmount = parseContrib(getQueryParameter('contributionValue'), 'ONE_OFF').amount;
const country = detectCountry();
const currency = currencyForCountry(country);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(reducer(contributionAmount, currency, country), {
  intCmp: getQueryParameter('INTCMP'),
  refpvid: getQueryParameter('REFPVID'),
}, composeEnhancers(applyMiddleware(thunkMiddleware)));

user.init(store.dispatch);

store.dispatch(setPayPalButton(window.guardian.payPalType));

const state: CombinedState = store.getState();

const contribDescription: string = (country === 'US' ? 'one-time' : 'one-off');

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <TestUserBanner />
      <SimpleHeader />
      <div className="oneoff-contrib gu-content-margin">
        <InfoSection className="oneoff-contrib__header">
          <h1 className="oneoff-contrib__heading">{`Make a ${contribDescription} contribution`}</h1>
          <Secure />
        </InfoSection>
        <InfoSection heading={`Your ${contribDescription} contribution`} className="oneoff-contrib__your-contrib">
          <PaymentAmount
            amount={state.oneoffContrib.amount}
            currency={state.oneoffContrib.currency}
          />
        </InfoSection>
        <InfoSection heading="Your details" className="oneoff-contrib__your-details">
          <FormFields />
        </InfoSection>
        <InfoSection heading="Payment methods" className="oneoff-contrib__payment-methods">
          <PaymentMethodsContainer
            stripeCallback={postCheckout}
            payPalCallback={postCheckout}
            payPalType={store.getState().oneoffContrib.payPalType}
          />
        </InfoSection>
      </div>
      <div className="terms-privacy gu-content-filler">
        <InfoSection className="terms-privacy__content gu-content-filler__inner">
          <TermsPrivacy
            termsLink={termsLinks[country]}
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
          <ContribLegal />
        </InfoSection>
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('oneoff-contributions-page'));
