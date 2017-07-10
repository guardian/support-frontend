// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import pageStartup from 'helpers/pageStartup';


// ----- Page Startup ----- //

pageStartup.start();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <div className="contributions-landing gu-content-margin">
      <h1>Contribute</h1>
    </div>
    <SimpleFooter />
  </div>
);

ReactDOM.render(content, document.getElementById('contributions-landing-page-uk'));
