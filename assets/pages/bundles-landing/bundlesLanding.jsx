// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import { init as pageInit } from 'helpers/page/page';
import { setIntCmp } from 'helpers/page/pageActions';
import { inCampaign } from 'helpers/tracking/guTracking';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducers from './reducers/reducers';


// ----- Redux Store ----- //

const store = pageInit(reducers);


// ----- Setup ----- //

let intCmp = store.getState().page.intCmp;

if (!intCmp) {
  intCmp = 'gdnwb_copts_bundles_landing_default';
  store.dispatch(setIntCmp(intCmp));
}


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <Introduction />
      <Bundles />
      <WhySupport />
      {inCampaign('baseline_test', intCmp) ? '' : <WaysOfSupport />}
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('bundles-landing-page'));
