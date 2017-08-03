// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import ProgressMessage from 'components/progressMessage/progressMessage';


// ----- Types ----- //

type PropTypes = {
  email: string,
  hide: boolean,
  error: ?string,
  payPalButtonExists: boolean,
  stripeCallback: Function,
  payPalCallback: Function,
  processing: boolean,
};


// ----- Component ----- //

export default function PaymentMethods(props: PropTypes) {

  let statusMessage = '';
  let stripeButton = <StripePopUpButton email={props.email} callback={props.stripeCallback} />;
  let payPalButton = '';

  if (props.payPalButtonExists) {
    payPalButton = <PayPalExpressButton callback={props.payPalCallback} />;
  }

  if (props.hide) {
    statusMessage = <ErrorMessage message={'Please fill in all the fields above.'} />;
    stripeButton = '';
    payPalButton = '';
  } else if (props.error !== null && props.error !== undefined) {
    statusMessage = <ErrorMessage message={props.error} />;
  } else if (props.processing) {
    statusMessage = <ProgressMessage message={'Processing transaction...'} />;
  }

  return (
    <section className="payment-methods">
      {statusMessage}
      {stripeButton}
      {payPalButton}
    </section>
  );
}
