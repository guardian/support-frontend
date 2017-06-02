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

const store = createStore(reducer);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <form>
      <SimpleHeader />
      <div>Make a contribution.</div>
      <SimpleFooter />
    </form>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
