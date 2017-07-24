// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PaypalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import ErrorMessage from 'components/errorMessage/errorMessage';


// ----- Types ----- //

type PropTypes = {
  email: string,
  firstName: string,
  lastName: string,
  error: ?string,
  payPalButtonExists: boolean,
  stripeCallback: Function,
  paypalCallback: Function,
};


// ----- Component ----- //

export default function PaymentMethods(props: PropTypes) {

  let errorMessage = '';
  let stripeButton = <StripePopUpButton email={props.email} callback={props.stripeCallback} />;
  let payPalButton = '';

  if (props.payPalButtonExists) {
    payPalButton = <PaypalExpressButton callback={props.paypalCallback} />;
  }

  if (props.firstName === '' || props.lastName === '') {
    errorMessage = <ErrorMessage message={'Please fill in all the fields above.'} />;
    stripeButton = '';
    payPalButton = '';
  } else if (props.error !== null) {
    errorMessage = <ErrorMessage message={'There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'} />;
  }

  return (
    <section className="payment-methods">
      {errorMessage}
      {stripeButton}
      {payPalButton}
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
  };

}
