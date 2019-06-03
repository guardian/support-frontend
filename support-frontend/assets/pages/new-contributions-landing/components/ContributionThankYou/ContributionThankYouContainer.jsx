// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';
import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  thankYouPageStage: ThankYouPageStage,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {
  const classModifiers = {
    thankYou: ['thankyou'],
    thankYouSetPassword: [],
    thankYouPasswordDeclinedToSet: ['thankyou'],
    thankYouPasswordSet: ['thankyou'],
  };

  const classNames = classNameWithModifiers('gu-content__content', classModifiers[props.thankYouPageStage]);

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (<ContributionThankYou />),
    thankYouSetPassword: (<ContributionThankYouSetPassword />),
    thankYouPasswordDeclinedToSet: (<ContributionThankYou />),
    thankYouPasswordSet: (<ContributionThankYouPasswordSet />),
  };

  return (
    <div className={classNames}>
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
