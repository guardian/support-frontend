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
import getQueryParameter from 'helpers/url';
import PaymentMethods from './components/paymentMethods';
import NameForm from './components/nameForm';
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

// Retrieves the contrib amount from the url and sends it to the redux store.
store.dispatch({
  type: 'SET_CONTRIB_AMOUNT',
  amount: getQueryParameter('contributionValue', '5'),
});


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <h1>Make a monthly contribution</h1>
      <NameForm />
      <h2>Your contribution</h2>
      <div>{store.getState()}</div>
      <PaymentMethods />
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
