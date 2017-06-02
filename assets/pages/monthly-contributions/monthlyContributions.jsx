// @flow

// ----- Imports ----- //

import 'ophan';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import TextInput from 'components/textInput/textInput';

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
    <div>
      <SimpleHeader />
      <h1>Make a monthly contribution</h1>
      <form>
        <TextInput id="first-name" labelText="First name" />
        <TextInput id="last-name" labelText="Last name" />
      </form>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
