// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import type { Store } from 'redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import Mothership from './components/mothershipNewDesign';
import Contribute from './components/contributeNewDesign';
import BehindTheScenes from './components/behindTheScenesNewDesign';
import Subscribe from './components/subscribeNewDesign';
import WhySupport from './components/whySupportNewDesign';
import Ready from './components/readyNewDesign';


// ----- Render ----- //

export default function supportLanding(store: Store) {

  return (
    <Provider store={store}>
      <div className="gu-content support-landing">
        <SimpleHeader />
        <Mothership />
        <Contribute />
        <BehindTheScenes />
        <Subscribe />
        <WhySupport />
        <Ready />
        <SimpleFooter />
      </div>
    </Provider>
  );

}
