// @flow

// ----- Imports ----- //

import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, compose } from 'redux';
import { init as pageInit } from 'helpers/page/page';
import { Provider } from 'react-redux';
import { renderPage } from 'helpers/render';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';
import reducer from './contributionsThankYouReducer';
import MarketingConsent from './components/marketingConsent';
import ThankYouIntroduction from './components/thankYouIntroduction';
import QuestionsAndSocial from './components/questionsAndSocial';
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

const marketing = () => {
  if (store.getState().page.user.email) {
    return <MarketingConsent />;
  }
  return (
    <div className="thankyou__wrapper">
      <CtaLink
        ctaId="return-to-the-guardian"
        text="Return to the Guardian"
        url="https://theguardian.com"
        accessibilityHint="Go to the guardian dot com front page"
      />
    </div>
  );
};

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <div className="thankyou gu-content-filler">
        <div className="thankyou__content gu-content-filler__inner">
          <ThankYouIntroduction thankYouMessage="You&#39;ve made a vital contribution that will help us maintain our independent,
              investigative journalism."
          />
          {marketing()}
          <QuestionsAndSocial />
        </div>
      </div>
      <Footer />
    </div>
  </Provider>
);

renderPage(content, 'oneoff-contributions-thankyou-page');
