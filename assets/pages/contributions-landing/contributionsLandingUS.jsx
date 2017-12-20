// @flow

// ----- Imports ----- //

import React from 'react';
import { applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import { defaultAmountsUS } from 'helpers/abTests/amountsTest';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import reducer from './contributionsLandingReducers';
import { saveContext } from './helpers/context';
import ContributionsBundleContent from './components/contributionsBundleContent';

import { changeContribAmountMonthly } from './contributionsLandingActions';


// ----- Page Startup ----- //

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = pageInit(reducer, undefined, composeEnhancers(applyMiddleware(thunkMiddleware)));

saveContext(store.dispatch);

(function initialiseAmountsTest() {
  try {
    const testParticipation = store.getState().common.abParticipations.usRecurringAmountsTestTwo;
    const defaultSelectedAmount =
      defaultAmountsUS[testParticipation]
      || defaultAmountsUS.control;
    return store.dispatch(changeContribAmountMonthly({
      value: defaultSelectedAmount, userDefined: false,
    }));
  } catch (e) { return null; }
}());


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <section className="contributions-bundle">
        <ContributionsBundleContent />
      </section>
      <section className="contributions-legal gu-content-filler">
        <div className="contributions-legal__content gu-content-filler__inner">
          <ContribLegal />
        </div>
      </section>
      <Footer privacyPolicy />
    </div>
  </Provider>
);

renderPage(content, 'contributions-landing-page-us');
