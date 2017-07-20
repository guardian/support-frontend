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
      <section className="contributions-bundle">
        <div className="introduction-bleed-margins" />
        <div className="contributions-bundle__content gu-content-margin">
          <div className="introduction-bleed" />
          <ContributionsBundle />
        </div>
      </section>
      <section className="contributions-legal">
        <div className="contributions-legal__content gu-content-margin">
          <p className="contributions-legal__segment">
            The ultimate owner of the Guardian is The Scott Trust Limited,
            whose role it is to secure the editorial and financial independence
            of the Guardian in perpetuity. Reader contributions support the
            Guardian’s journalism.&nbsp;
          </p>
          <p className="contributions-legal__segment">
            Please note that your support of the Guardian’s journalism does not
            constitute a charitable donation, as such your contribution is not
            eligible for Gift Aid in the UK nor a tax-deduction elsewhere.&nbsp;
          </p>
          <p className="contributions-legal__segment">
            If you have any questions about contributing to the Guardian,
            please contact us here.&nbsp;
          </p>
        </div>
      </section>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('contributions-landing-page-uk'));
