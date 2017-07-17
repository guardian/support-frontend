// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

type PropTypes = {
  email: string,
  name: string,
  error: ?string,
};


// ----- Component ----- //

function PaymentMethods(props: PropTypes) {

  let errorMessage = '';
  let stripeButton = '';

  if (props.name === '' || props.email === '') {
    errorMessage = <ErrorMessage message={'Please fill in all the fields above.'} />;
    stripeButton = '';
  } else if (props.error !== null) {
    errorMessage = <ErrorMessage message={'There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'} />;
  } else {
    stripeButton = <StripePopUpButton email={props.email} callback={postCheckout} />;
  }

  return (
    <section className="payment-methods">
      {errorMessage}
      {stripeButton}
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    name: state.user.fullName,
    error: state.monthlyContrib.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
