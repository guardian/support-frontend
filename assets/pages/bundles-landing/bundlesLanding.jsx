// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import { init as pageInit } from 'helpers/page/page';
import { setIntCmp } from 'helpers/page/pageActions';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './reducers/reducers';
import { trackOphan } from '../../helpers/abtest';


// ----- Page Startup ----- //

const participation = pageStartup.start();
setCountry('GB');


// ----- Redux Store ----- //

const store = pageInit(reducer);


// ----- Setup ----- //

let intCmp = store.getState().common.intCmp;

if (!intCmp) {
  intCmp = 'gdnwb_copts_bundles_landing_default';
  store.dispatch(setIntCmp(intCmp));
}

let participations = store.getState().common.abParticipations;
if (participations.annualContributions) {
  trackOphan('annualContributions', participations.annualContributions);
}


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <Introduction />
      <Bundles />
      <WhySupport />
      {store.getState().common.campaign === 'baseline_test' ? '' : <WaysOfSupport />}
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('bundles-landing-page'));
