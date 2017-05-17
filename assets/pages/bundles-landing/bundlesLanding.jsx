// @flow

// ----- Imports ----- //
import 'ophan';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import getQueryParameter from './helpers/queryParameter';
import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './reducers/reducers';


// ----- Redux Store ----- //

const store = createStore(reducer, { intCmp: getQueryParameter('INTCMP', 'gdnwb_copts_bundles_landing_default') });


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <Introduction />
      <Bundles />
      <br style={{ clear: 'both' }} />
      <WhySupport />
      <WaysOfSupport />
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('bundles-landing-page'));
