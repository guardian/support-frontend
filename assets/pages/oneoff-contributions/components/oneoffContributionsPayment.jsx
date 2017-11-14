// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import ErrorMessage from 'components/errorMessage/errorMessage';

import type { Node } from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';
import type { Currency } from 'helpers/internationalisation/currency';

import { checkoutError } from '../oneoffContributionsActions';
import postCheckout from '../helpers/ajax';

// ----- Types ----- //

export type PayPalButtonType = 'ContributionsCheckout' | 'NotSet';

type PropTypes = {
  dispatch: Function,
  email: string,
  error: ?string,
  isFormEmpty: boolean,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  checkoutError: (?string) => void,
  abParticipations: Participations,
  currency: Currency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(isFormEmpty: boolean, error: ?string): Node {

  if (error !== null && error !== undefined) {
    return <ErrorMessage message={error} />;
  }

  return null;

}

// If the form is valid, calls the given callback, otherwise sets an error.
function formValidation(
  isFormEmpty: boolean,
  error: ?string => void,
): Function {

  return (): boolean => {

    if (!isFormEmpty) {
      if (error) {
        error(null);
      }
      return true;
    }

    if (error) {
      error('Please fill in all the fields above.');
    }
    return false;
  };

}


// ----- Component ----- //


/*
 * WARNING: we are using the React context here to be able to pass the getState function
 * to the postCheckout function. PostCheckout requires this function to access to the
 * most recent user.
 * More information here:https://reactjs.org/docs/context.html
 * You should not use context for other purposes. Please use redux.
 */
function OneoffContributionsPayment(props: PropTypes, context) {

  return (
    <section className="oneoff-contribution-payment">
      {getStatusMessage(props.isFormEmpty, props.error)}

      <StripePopUpButton
        email={props.email}
        callback={postCheckout(
          props.abParticipations,
          props.dispatch,
          props.amount,
          props.currency,
          props.referrerAcquisitionData,
          context.store.getState,
        )}
        canOpen={formValidation(props.isFormEmpty, props.checkoutError)}
        currency={props.currency}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        amount={props.amount}
      />
      <PayPalContributionButton
        amount={props.amount}
        referrerAcquisitionData={props.referrerAcquisitionData}
        isoCountry={props.isoCountry}
        errorHandler={props.checkoutError}
        abParticipations={props.abParticipations}
      />
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    isFormEmpty: state.page.user.email === '' || state.page.user.fullName === '',
    amount: state.page.oneoffContrib.amount,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    isoCountry: state.common.country,
    abParticipations: state.common.abParticipations,
    currency: state.page.oneoffContrib.currency,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    dispatch,
    checkoutError: (message: ?string) => {
      dispatch(checkoutError(message));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
