// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import ProgressMessage from 'components/progressMessage/progressMessage';

import type { Node } from 'react';
import type { Contrib } from 'helpers/contributions';

import postCheckout from '../helpers/ajax';


// ----- Types ----- //

export type PaymentStatus = 'NotStarted' | 'Pending' | 'Failed';

export type PayPalButtonType = 'ExpressCheckout' | 'NotSet';

type PropTypes = {
  email: string,
  hide: boolean,
  error: ?string,
  contributionType: Contrib,
  paymentStatus: PaymentStatus,
};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(
  paymentStatus: PaymentStatus,
  hide: boolean,
  error: ?string,
): Node {

  if (paymentStatus === 'Pending') {
    return <ProgressMessage message={['Processing transaction', 'Please wait']} />;
  } else if (hide) {
    return <ErrorMessage message="Please fill in all the fields above." />;
  } else if (error !== null && error !== undefined) {
    return <ErrorMessage message={error} />;
  }

  return null;

}

// Provides the Stripe button component.
function getStripeButton(hide: boolean, email: string, contribType: Contrib): Node {

  if (hide) {
    return null;
  }

  return (
    <StripePopUpButton
      email={email}
      callback={postCheckout('stripeToken', contribType)}
    />
  );

}

// Provides the PayPal Express Checkout button component.
function getPayPalButton(hide: boolean, contribType: Contrib): Node {

  if (hide) {
    return null;
  }

  return <PayPalExpressButton callback={postCheckout('baid', contribType)} />;

}


// ----- Component ----- //

function RegularContributionsPayment(props: PropTypes) {

  return (
    <section className="regular-contribution-payment">
      {getStatusMessage(props.paymentStatus, props.hide, props.error)}
      {getStripeButton(props.hide, props.email, props.contributionType)}
      {getPayPalButton(props.hide, props.contributionType)}
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    hide: state.page.user.firstName === '' || state.page.user.lastName === '',
    error: state.page.regularContrib.error,
    paymentStatus: state.page.regularContrib.paymentStatus,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(RegularContributionsPayment);
