// @flow

// ----- Imports ----- //

import type { PaymentMethod } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  thankYouPageStage: ThankYouPageStage,
  paymentMethod: PaymentMethod,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  paymentMethod: state.page.form.paymentMethod,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (<ContributionThankYou showDirectDebitCopy={props.paymentMethod === 'DirectDebit'} />),
    thankYouSetPassword: (<ContributionThankYouSetPassword />),
    thankYouPasswordDeclinedToSet: (<ContributionThankYou />),
    thankYouPasswordSet: (<ContributionThankYouPasswordSet />),
  };


  return (
    <div className="gu-content__content">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
