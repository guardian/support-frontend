// @flow

// ----- Imports ----- //

import React from 'react';
import { statelessInit as pageInit } from 'helpers/page/page';

// ----- Page Startup ----- //

pageInit();

// ----- Component ----- //


type PropTypes = {
  thankYouMessage: string,
};


function ThankYou(props: PropTypes) {
  return (
    <section className="component-info-section component-marketing">
      <div className="thankyou__wrapper">
        <h1 className="thankyou__heading">Thank you!</h1>
        <h2 id="qa-thank-you-message" className="thankyou__subheading">
          <p>{props.thankYouMessage}</p>
        </h2>
      </div>
    </section>
  );
}

// ----- Exports ----- //

export default ThankYou;

