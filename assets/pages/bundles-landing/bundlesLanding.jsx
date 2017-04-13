// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Bundles from './components/Bundles';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './reducers/paperBundle';


// ----- Redux Store ----- //

const store = createStore(reducer, 'PAPER+DIGITAL');


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <Bundles />
      <br style="clear:both;"/>
      <WaysOfSupport/>
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('bundles-landing-page'));
