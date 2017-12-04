// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { defaultAmountsUK } from 'helpers/abTests/amountsTest';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import PartialBundle from './components/PartialBundle';
import BundlesGBStructureTest from './components/bundlesGBStructureTest';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './bundlesLandingReducers';

// Amounts test
import { changeContribAmountMonthly } from './bundlesLandingActions';


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  reducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const structureTestVariant = store.getState().common.abParticipations.gbStructureTest;
// const bundlesSelected = structureTestVariant === 'contributeOnTop' ? <BundlesGBStructureTest /> : <Bundles />;

const url: URL = new URL(window.location.href);
const bundle: ?string = url.searchParams.get('bundle');
const bundlesSelected = bundle ? <PartialBundle bundle={bundle} /> : <Bundles />;

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <Introduction />
      {bundlesSelected}
      <WhySupport />
      <WaysOfSupport />
      <Footer privacyPolicy disclaimer />
    </div>
  </Provider>
);

(function initialiseAmountsTest() {
  try {
    const defaultSelectedAmount =
      defaultAmountsUK[store.getState().common.abParticipations.ukRecurringAmountsTest]
      || defaultAmountsUK.control;
    return store.dispatch(changeContribAmountMonthly({
      value: defaultSelectedAmount, userDefined: false,
    }));
  } catch (e) { return null; }
}());

renderPage(content, 'bundles-landing-page');
