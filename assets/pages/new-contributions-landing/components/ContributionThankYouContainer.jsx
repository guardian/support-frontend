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
});


const thankYouPageStage: {
  [ThankYouPageStage]: React$Element<*>,
} = {
  setPassword: (<SetPassword />),
  thankYou: (<ContributionThankYou />),
};


// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  return (
    <div className="gu-content__content">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);