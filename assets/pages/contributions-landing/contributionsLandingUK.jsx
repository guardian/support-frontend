// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import IntroductionText from 'components/introductionText/introductionText';

import pageStartup from 'helpers/pageStartup';
import getQueryParameter from 'helpers/url';

import reducer from './reducers/reducers';
import ContributionsBundle from './components/contributionsBundle';


// ----- Page Startup ----- //

pageStartup.start();


// ----- Redux Store ----- //

const store = createStore(reducer, {
  intCmp: getQueryParameter('INTCMP', 'gdnwb_copts_bundles_landing_default'),
});


// ----- Copy ----- //

const introductionCopy = [
  {
    heading: 'support the Guardian',
    copy: ['be part of our future', 'by helping to secure it'],
  },
  {
    heading: 'hold power to account',
    copy: ['by funding quality,', 'independent journalism'],
  },
];


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <IntroductionText messages={introductionCopy} />
      <div className="contributions-landing gu-content-margin">
        <ContributionsBundle />
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('contributions-landing-page-uk'));
