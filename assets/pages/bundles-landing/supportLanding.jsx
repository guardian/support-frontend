// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import Contribute from './components/contributeNewDesign';
import Subscribe from './components/subscribeNewDesign';
import WhySupport from './components/whySupportNewDesign';
import Ready from './components/readyNewDesign';


// ----- Render ----- //

export default function supportLanding(store) {

  return (
    <Provider store={store}>
      <div className="gu-content support-landing">
        <SimpleHeader />
        <Contribute />
        <Subscribe />
        <WhySupport />
        <Ready />
        <SimpleFooter />
      </div>
    </Provider>
  );

}
