// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import LinksFooter from 'components/footers/linksFooter/linksFooter';

import { trackOphan } from 'helpers/abtest';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './bundlesLandingReducers';


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  reducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

// ----- Setup ----- //

const participations = store.getState().common.abParticipations;
if (participations.addAnnualContributions) {
  trackOphan('addAnnualContributions', participations.addAnnualContributions);
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
      <LinksFooter />
    </div>
  </Provider>
);

renderPage(content, 'bundles-landing-page');
