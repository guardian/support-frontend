// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import {
  type Contrib,
} from 'helpers/contributions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';
import { type State } from '../contributionsLandingReducer';
import { ExistingRecurringContributorErrorMessage } from './ExistingRecurringContributorErrorMessage';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  email: string,
  contributionType: Contrib,
  paymentError: CheckoutFailureReason | null,
  isSignedIn: boolean,
  formIsValid: boolean,
  isRecurringContributor: boolean,
  checkoutFormHasBeenSubmitted: boolean,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  paymentMethod: state.page.form.paymentMethod,
  contributionType: state.page.form.contributionType,
  paymentError: state.page.form.paymentError,
  isSignedIn: state.page.user.isSignedIn,
  formIsValid: state.page.form.formIsValid,
  isRecurringContributor: state.page.user.isRecurringContributor,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
});

// ----- Functions ----- //

// ----- Render ----- //

function ContributionErrorMessage(props: PropTypes) {
  const shouldsShowExistingContributorErrorMessage = (props.contributionType !== 'ONE_OFF' && props.isRecurringContributor && props.checkoutFormHasBeenSubmitted);

  if (props.paymentError) {
    return (<PaymentFailureMessage checkoutFailureReason={props.paymentError} />);
  } else if (!props.formIsValid) {
    return (
      <PaymentFailureMessage
        classModifiers={['invalid_form_mobile']}
        errorHeading="Form incomplete"
        checkoutFailureReason="invalid_form_mobile"
      />
    );
  } else if (shouldsShowExistingContributorErrorMessage) {
    return (
      <ExistingRecurringContributorErrorMessage
        contributionType={props.contributionType}
        checkoutFormHasBeenSubmitted={props.checkoutFormHasBeenSubmitted}
        isRecurringContributor={props.isRecurringContributor}
      />
    );
  }
  return null;
}

export default connect(mapStateToProps)(ContributionErrorMessage);

