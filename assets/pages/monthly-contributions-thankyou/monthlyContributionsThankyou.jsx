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
  <div>
    <SimpleHeader />
    <section className="thankyou">
      <div className="thankyou__content gu-content-margin">
        <h1 className="thankyou__heading">Thank you!</h1>
        <h2 className="thankyou__subheading">You&#39;re now making a vital monthly contribution that will help us maintain our independent, investigative journalism</h2>
      </div>
    </section>
    <SimpleFooter />
  </div>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-thankyou-page'));
