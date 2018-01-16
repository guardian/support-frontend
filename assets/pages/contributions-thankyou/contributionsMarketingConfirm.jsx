// @flow

// ----- Imports ----- //

import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, compose } from 'redux';
import { init as pageInit } from 'helpers/page/page';
import { getQueryParameter } from 'helpers/url'
import { Provider } from 'react-redux';
import { renderPage } from 'helpers/render';
import CtaLink from 'components/ctaLink/ctaLink';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYou from './components/thankYou';
import QuestionsAndSocial from './components/questionsAndSocial';
import reducer from './contributionsThankyouReducer';
import * as user from '../../helpers/user/user';


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

const copy = getQueryParameter('optIn') === 'yes'
  ? 'We\'ll be in touch. Check your inbox for a confirmation link.'
  : 'Your preference has been recorded.';

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <section className="thankyou gu-content-filler">
        <div className="thankyou__content gu-content-filler__inner">
          <ThankYou thankYouMessage={copy} />
          <div className="thankyou__wrapper">
          <CtaLink
            ctaId="return-to-the-guardian"
            text="Return to the Guardian"
            url="https://theguardian.com"
            accessibilityHint="Go to the guardian dot com front page"
          />
          </div>
          <QuestionsAndSocial />
        </div>
      </section>
      <Footer />
    </div>
  </Provider>
);


renderPage(content, 'contributions-confirm-marketing');
