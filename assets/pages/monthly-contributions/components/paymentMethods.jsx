// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PaypalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

type PropTypes = {
  email: string,
  firstName: string,
  lastName: string,
  error: ?string,
  payPalButtonExists: boolean,
};


// ----- Component ----- //

function PaymentMethods(props: PropTypes) {

  let errorMessage = '';
  let stripeButton = <StripePopUpButton email={props.email} callback={postCheckout('stripeToken')} />;
  let payPalButton = '';

  if (props.payPalButtonExists) {
    payPalButton = <PaypalExpressButton callback={postCheckout('baid')} />;
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
    error: state.monthlyContrib.error,
    payPalButtonExists: state.monthlyContrib.payPalButtonExists,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
