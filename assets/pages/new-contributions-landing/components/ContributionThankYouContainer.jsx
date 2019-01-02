// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  thankYouPageStage: ThankYouPageStage,
  countryGroupId: CountryGroupId,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  countryGroupId: state.common.internationalisation.countryGroupId,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (<ContributionThankYou />),
    thankYouSetPassword: (<ContributionThankYouSetPassword />),
    thankYouPasswordDeclinedToSet: (<ContributionThankYou />),
    thankYouPasswordSet: (<ContributionThankYouPasswordSet countryGroupId={props.countryGroupId} />),
  };


  return (
    <div className="gu-content__content">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
