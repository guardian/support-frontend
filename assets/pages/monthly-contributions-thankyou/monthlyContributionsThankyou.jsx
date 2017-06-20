// @flow

// ----- Imports ----- //

import 'ophan';
import React from 'react';
import ReactDOM from 'react-dom';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';

import * as ga from 'helpers/ga';
import * as abTest from 'helpers/abtest';
import * as logger from 'helpers/logger';


// ----- AB Tests ----- //

const participation = abTest.init();


// ----- Tracking ----- //

ga.init();
ga.setDimension('experience', abTest.getVariantsAsString(participation));
ga.trackPageview();


// ----- Logging ----- //

logger.init();


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
