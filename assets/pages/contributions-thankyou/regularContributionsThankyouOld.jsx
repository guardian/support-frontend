// @flow

// ----- Imports ----- //

import React from 'react';
import { applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import * as user from 'helpers/user/user';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import DotcomCta from 'components/dotcomCta/dotcomCta';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from './components/thankYouIntroduction';
import QuestionsAndSocial from './components/questionsAndSocial';
import reducer from './contributionsThankYouReducer';
import MarketingConsentContainer from './components/marketingConsentContainer';


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
    return <MarketingConsentContainer />;
  }
  return (<DotcomCta />);
};


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <section className="thankyou gu-content-filler">
        <div className="thankyou__content gu-content-filler__inner">
          <ThankYouIntroduction thankYouMessage="You have helped to make the Guardian&#39;s future more secure.
              Look out for an email confirming your recurring
              payment."
          />
          {marketing()}
          <QuestionsAndSocial />
        </div>
      </section>
      <Footer />
    </div>
  </Provider>
);

renderPage(content, 'regular-contributions-thankyou-page-old');
