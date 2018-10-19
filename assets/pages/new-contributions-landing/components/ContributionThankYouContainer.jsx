// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStage } from '../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import SetPassword from './SetPassword/SetPassword';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  thankYouPageStage: ThankYouPageStage,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  passwordHasBeenSet: state.page.form.setPasswordData,
  paymentMethod: state.page.form.paymentMethod,
});



// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  return (
    <div className="gu-content__content">
      {props.thankYouPageStage === 'setPassword' ? <SetPassword /> : <ContributionThankYou />}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
