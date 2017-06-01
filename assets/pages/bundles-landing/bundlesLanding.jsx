// @flow

// ----- Imports ----- //

import 'ophan';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import * as ga from 'helpers/ga';
import * as abTest from 'helpers/abtest';
import * as logger from 'helpers/logger';
import getQueryParameter from './helpers/queryParameter';
import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './reducers/reducers';

// ----- AB Tests ----- //

const participation = abTest.init();


// ----- Tracking ----- //

ga.init();
ga.setDimension('experience', abTest.getVariantsAsString(participation));
ga.trackPageview();

// ----- Logging ----- //

logger.init();

// ----- Redux Store ----- //

const store = createStore(reducer, { intCmp: getQueryParameter('INTCMP', 'gdnwb_copts_bundles_landing_default') });

store.dispatch({ type: 'SET_AB_TEST_PARTICIPATION', payload: participation });

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <Introduction />
      <Bundles />
      <WhySupport />
      <WaysOfSupport />
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('bundles-landing-page'));
