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
import { termsLinks } from 'helpers/internationalisation/legal';
import * as user from 'helpers/user/user';
import { getQueryParameter } from 'helpers/url';
import { parse as parseAmount } from 'helpers/contributions';

import postCheckout from './helpers/ajax';
import FormFields from './components/formFields';
import PaymentMethodsContainer from './components/paymentMethodsContainer';
import reducer from './reducers/reducers';
import type { CombinedState } from './reducers/reducers';

import { setPayPalButton } from './actions/monthlyContributionsActions';
import { parseContrib } from '../../helpers/contributions';


// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
const contributionAmount = parseAmount(getQueryParameter('contributionValue'), contributionType).amount;
const country = detectCountry();
const currency = currencyForCountry(country);

const title = {
  annual: 'Make an annual contribution',
  monthly: 'Make a monthly contribution',
};

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
    <div className="gu-content">
      <TestUserBanner />
      <SimpleHeader />
      <div className="monthly-contrib gu-content-margin">
        <InfoSection className="monthly-contrib__header">
          <h1 className="monthly-contrib__heading">{title[contributionType.toLowerCase()]}</h1>
          <Secure />
        </InfoSection>
        <InfoSection heading={`Your ${contributionType.toLowerCase()} contribution`} className="monthly-contrib__your-contrib">
          <PaymentAmount
            amount={state.monthlyContrib.amount}
            currency={state.monthlyContrib.currency}
          />
        </InfoSection>
        <InfoSection heading="Your details" className="monthly-contrib__your-details">
          <DisplayName />
          <FormFields />
        </InfoSection>
        <InfoSection heading="Payment methods" className="monthly-contrib__payment-methods">
          <PaymentMethodsContainer
            stripeCallback={postCheckout('stripeToken', contributionType)}
            payPalCallback={postCheckout('baid', contributionType)}
            payPalType={state.monthlyContrib.payPalType}
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

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
