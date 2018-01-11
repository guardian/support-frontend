// @flow

// ----- Imports ----- //

import React from 'react';
import { statelessInit as pageInit } from 'helpers/page/page';

// ----- Page Startup ----- //

pageInit();

// ----- Component ----- //


function ThankYou() {
  return (
      <section className="component-info-section__heading thankyou__thankyou">
        <div className="thankyou__wrapper">
          <h1 className="thankyou__heading">Thank you!</h1>
          <h2 id="qa-thank-you-message" className="thankyou__subheading">
            <p>You have helped to make the Guardian&#39;s future more secure.
              Look out for an email confirming your recurring
              payment.
            </p>
          </h2>
        </div>
      </section>
  );
}

// ----- Exports ----- //

export default ThankYou;

