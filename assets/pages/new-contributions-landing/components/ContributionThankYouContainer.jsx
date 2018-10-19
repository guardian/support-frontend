// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import SetPassword from './SetPassword/SetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  thankYouPageStage: ThankYouPageStage,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
});

// TODO: change landing page copy if password has/hasn't been set
const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
  setPassword: (<SetPassword />),
  thankYou: (<ContributionThankYou />),
  thankYouPasswordSet: (<ContributionThankYouPasswordSet />),
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
