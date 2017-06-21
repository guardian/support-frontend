// @flow

// ----- Imports ----- //
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import * as pageStartup from 'helpers/pageStartup'
import getQueryParameter from 'helpers/url';
import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './reducers/reducers';

const participation = pageStartup.start();

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
