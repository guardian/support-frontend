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
};


// ----- Component ----- //

function PaymentMethods(props: PropTypes) {

  let errorMessage = '';
  let stripeButton = <StripePopUpButton email={props.email} callback={postCheckout} />;
  const payPalButton = <PaypalExpressButton />;

  if (props.firstName === '' || props.lastName === '') {
    errorMessage = <ErrorMessage message={'Please fill in all the fields above.'} />;
    stripeButton = '';
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
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
