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
import MarketingConsent from 'components/thankyouPageComponents/recurringContributions/marketingConsent/marketingConsent';
import ThankYou from 'components/thankyouPageComponents/recurringContributions/thankYou';
import reducer from './regularContributionsThankyouReducer';
import type { PageState } from './regularContributionsThankyouReducer';
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

const state: PageState = store.getState();
console.log(state.page);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <section className="thankyou gu-content-filler">
        <div className="thankyou__content gu-content-filler__inner">
          <MarketingConsent />
          <ThankYou />
        </div>
      </section>
      <Footer />
    </div>
  </Provider>
);


renderPage(content, 'regular-contributions-pending-page');
