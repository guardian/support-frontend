// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';
import type { ThankYouPageMarketingComponentTestVariants } from 'helpers/abTests/abtestDefinitions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  thankYouPageStage: ThankYouPageStage,
  marketingComponentVariant: ThankYouPageMarketingComponentTestVariants,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  marketingComponentVariant: state.common.abParticipations.thankYouPageMarketingComponent,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (
      <ContributionThankYou marketingComponentVariant={props.marketingComponentVariant} />
    ),
    thankYouSetPassword: (
      <ContributionThankYouSetPassword />
    ),
    thankYouPasswordDeclinedToSet: (
      <ContributionThankYou marketingComponentVariant={props.marketingComponentVariant} />
    ),
    thankYouPasswordSet: (
      <ContributionThankYouPasswordSet marketingComponentVariant={props.marketingComponentVariant} />
    ),
  };

  return (
    <div className="gu-content__content gu-content__content-thankyou">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
