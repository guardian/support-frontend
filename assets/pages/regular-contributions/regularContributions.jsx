// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, compose } from 'redux';
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
import Signout from 'components/signout/signout';

import { forCountry as currencyForCountry } from 'helpers/internationalisation/currency';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { termsLinks } from 'helpers/internationalisation/legal';
import * as user from 'helpers/user/user';
import { getQueryParameter } from 'helpers/url';
import { parse as parseAmount } from 'helpers/contributions';
import { init as pageInit } from 'helpers/page/page';

import FormFields from './components/formFields';
import RegularContributionsPayment from './components/regularContributionsPayment';
import reducer from './regularContributionsReducers';
import type { PageState } from './regularContributionsReducers';

import { setPayPalButton } from './regularContributionsActions';
import { parseContrib } from '../../helpers/contributions';


// ----- Page Startup ----- //

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

const store = pageInit(
  reducer(contributionAmount, currency),
  undefined,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

user.init(store.dispatch);
store.dispatch(setPayPalButton(window.guardian.payPalType));

const state: PageState = store.getState();


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <TestUserBanner />
      <SimpleHeader />
      <div className="regular-contrib gu-content-margin">
        <InfoSection className="regular-contrib__header">
          <h1 className="regular-contrib__heading">{title[contributionType.toLowerCase()]}</h1>
          <Secure />
        </InfoSection>
        <InfoSection heading={`Your ${contributionType.toLowerCase()} contribution`} className="regular-contrib__your-contrib">
          <PaymentAmount
            amount={state.page.regularContrib.amount}
            currency={state.page.regularContrib.currency}
          />
        </InfoSection>
        <InfoSection heading="Your details" headingContent={<Signout />} className="regular-contrib__your-details">
          <DisplayName />
          <FormFields />
        </InfoSection>
        <InfoSection heading="Payment methods" className="regular-contrib__payment-methods">
          <RegularContributionsPayment contributionType={contributionType} />
        </InfoSection>
      </div>
      <div className="terms-privacy gu-content-filler">
        <InfoSection className="terms-privacy__content gu-content-filler__inner">
          <TermsPrivacy
            termsLink={termsLinks[state.common.country]}
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
          <ContribLegal />
        </InfoSection>
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

const element: ?Element = document.getElementById('regular-contributions-page');

if (element) {
  ReactDOM.render(content, element);
}
