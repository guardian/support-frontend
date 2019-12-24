// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  thankYouPageStage: ThankYouPageStage,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  countryId: state.common.internationalisation.countryId,
  countryGroupId: state.common.internationalisation.countryGroupId,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (
      <ContributionThankYou countryGroupId={props.countryGroupId} />
    ),
    thankYouSetPassword: (
      <ContributionThankYouSetPassword />
    ),
    thankYouPasswordDeclinedToSet: (
      <ContributionThankYou countryGroupId={props.countryGroupId} />
    ),
    thankYouPasswordSet: (
      <ContributionThankYouPasswordSet countryId={props.countryId} countryGroupId={props.countryGroupId} />
    ),
  };

  return (
    <div className="gu-content__content gu-content__content-thankyou">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
