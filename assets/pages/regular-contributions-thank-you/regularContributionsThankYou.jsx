// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from 'components/thankYouIntroduction/thankYouIntroduction';
import DotcomCta from 'components/dotcomCta/dotcomCta';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { applyMiddleware, compose } from 'redux';
import CtaLink from 'components/ctaLink/ctaLink';
import thunkMiddleware from 'redux-thunk';
import * as user from 'helpers/user/user';

import EmailConfirmation from './components/emailConfirmation';
import MarketingConsent from './components/marketingConsent';
import reducer from './regularThankYouReducer';
// ----- Page Startup ----- //

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */


const store = pageInit(
  reducer,
  undefined,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

user.init(store.dispatch);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <ThankYouIntroduction
        highlights={['Thank you']}
        headings={['for a valuable', 'contribution']}
      />
      <EmailConfirmation />
      <MarketingConsent />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  </Provider>
);

renderPage(content, 'regular-contributions-thank-you-page');