// @flow

// ----- Imports ----- //

import type { Contrib } from 'helpers/contributions';

import React from 'react';
import { applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import LinksFooter from 'components/footers/linksFooter/linksFooter';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import reducer from './contributionsLandingReducers';
import { saveContext } from './helpers/context';
import ContributionsBundleContent from './components/contributionsBundleContent';
import { changeContribType } from './contributionsLandingActions';

// ----- Page Startup ----- //

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = pageInit(reducer, undefined, composeEnhancers(applyMiddleware(thunkMiddleware)));

saveContext(store.dispatch);

(function initialiseMonthlyVsOneOffTest() {
  try {
    const contribType: Contrib =
        store.getState().common.abParticipations.usMonthlyVsOneOff.toUpperCase();

    return store.dispatch(changeContribType(contribType));
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
      <LinksFooter />
    </div>
  </Provider>
);

renderPage(content, 'contributions-landing-page-us');
