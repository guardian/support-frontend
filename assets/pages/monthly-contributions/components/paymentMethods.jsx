// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

type PropTypes = {
  email: string,
};


// ----- Component ----- //

function PaymentMethods(props: PropTypes) {

  return (
    <section className="payment-methods">
      <StripePopUpButton email={props.email} callback={postCheckout} />
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
