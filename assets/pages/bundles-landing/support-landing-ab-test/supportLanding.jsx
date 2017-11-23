// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Mothership from './components/mothershipNewDesign';
import Contribute from './components/contributeNewDesign';
import BehindTheScenes from './components/behindTheScenesNewDesign';
import Subscribe from './components/subscribeNewDesign';
import WhySupport from './components/whySupportNewDesign';
import Ready from './components/readyNewDesign';
import OtherWays from './components/otherWaysNewDesign';
import reducer from '../bundlesLandingReducers';


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  reducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <Mothership />
      <Contribute />
      <Subscribe />
      <BehindTheScenes />
      <WhySupport />
      <Ready />
      <OtherWays />
      <Footer disclaimer />
    </div>
  </Provider>
);

renderPage(content, 'support-landing-page');
