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
import MarketingConsent from './components/marketingConsent';
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

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <section className="thankyou gu-content-filler">
        <div className="thankyou__content gu-content-filler__inner">
          <ThankYou thankYouMessage="You have helped to make the Guardian&#39;s future more secure.
              Look out for an email confirming your recurring
              payment."
          />
          <MarketingConsent />
          <QuestionsAndSocial />
        </div>
      </section>
      <Footer />
    </div>
  </Provider>
);


renderPage(content, 'regular-contributions-pending-page');
