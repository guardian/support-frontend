// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import IntroductionText from 'components/introductionText/introductionText';

import pageStartup from 'helpers/pageStartup';


// ----- Page Startup ----- //

pageStartup.start();


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
  <div className="gu-content">
    <SimpleHeader />
    <IntroductionText messages={introductionCopy} />
    <div className="contributions-landing gu-content-margin">
      <h1>Contribute</h1>
    </div>
    <SimpleFooter />
  </div>
);

ReactDOM.render(content, document.getElementById('contributions-landing-page-uk'));
