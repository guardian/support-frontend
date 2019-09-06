// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';
import type { IsoCountry } from 'helpers/internationalisation/country';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  thankYouPageStage: ThankYouPageStage,
  countryForSurvey: IsoCountry,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  countryForSurvey: state.common.internationalisation.countryId,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (
      <ContributionThankYou countryForSurvey={props.countryForSurvey} />
    ),
    thankYouSetPassword: (
      <ContributionThankYouSetPassword />
    ),
    thankYouPasswordDeclinedToSet: (
      <ContributionThankYou countryForSurvey={props.countryForSurvey} />
    ),
    thankYouPasswordSet: (
      <ContributionThankYouPasswordSet countryForSurvey={props.countryForSurvey} />
    ),
  };

  return (
    <div className="gu-content__content gu-content__content-thankyou">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
