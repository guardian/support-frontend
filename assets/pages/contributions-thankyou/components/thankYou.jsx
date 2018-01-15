// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

// ----- Component ----- //

type PropTypes = {
  thankYouMessage: string,
  marketingPreferencesSelected: boolean,
};

function ThankYou(props: PropTypes) {
  const copy = props.marketingPreferencesSelected === true
    ? 'Your response has been recorded. Please check your email to confirm your selection.'
    : props.thankYouMessage;

  return (
    <section className="component-info-section__heading thankyou__component">
      <div className="thankyou__wrapper">
        <h3 className="thankyou__heading">Thank you!</h3>
        <h2 id="qa-thank-you-message" className="thankyou__subheading">
          <p>{copy}</p>
        </h2>
      </div>
    </section>
  );
}

function mapStateToProps(state) {
  return {
    marketingPreferencesSelected:
    state.page.regularContributionsThankYou.marketingPreferencesSelected,
  };
}

// ----- Exports ----- //

export default connect(mapStateToProps)(ThankYou);

