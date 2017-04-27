// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WaysOfSupport from './components/WaysOfSupport';
import SimpleFooter from '../../components/footers/simpleFooter/simpleFooter';
import reducer from './reducers/reducers';


// ----- Redux Store ----- //

const store = createStore(reducer);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <Introduction />
      <Bundles />
      <br style={{ clear: 'both' }} />
      <WaysOfSupport />
      <br style={{ clear: 'both' }} />
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('bundles-landing-page'));
