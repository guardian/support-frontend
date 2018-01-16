// @flow

// ----- Imports ----- //

import React from 'react';
// ----- Component ----- //

type PropTypes = {
  thankYouMessage: string,
};

function ThankYou(props: PropTypes) {
  return (
    <section className="component-info-section__heading thankyou__component">
      <div className="thankyou__wrapper">
        <h3 className="thankyou__heading">Thank you!</h3>
        <h2 id="qa-thank-you-message" className="thankyou__subheading">
          <p>{props.thankYouMessage}</p>
        </h2>
      </div>
    </section>
  );
}

// ----- Exports ----- //

export default ThankYou;

