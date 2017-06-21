// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import {
  openStripeOverlay,
  setupStripeCheckout,
} from 'helpers/stripeCheckout/stripeCheckoutActions';


// ---- Types ----- //

type PropTypes = {
  stripeLoaded: boolean,
  setupStripeCheckout: Function,
  onStripeClick: Function,
  amount: number,
  email: string,
  callback: Function,
};


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => {

  if (!props.stripeLoaded) {
    props.setupStripeCheckout(props.callback);
  }

  const stripeClick = () => props.onStripeClick(props.amount, props.email);

  return (
    <button
      className="component-stripe-pop-up-button"
      onClick={stripeClick}
    >Contribute with debit/credit card</button>
  );

};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    overlayOpen: state.stripeCheckout.overlay,
    stripeLoaded: state.stripeCheckout.loaded,
    amount: state.stripeCheckout.amount,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    setupStripeCheckout: (callback: Function) => {
      dispatch(setupStripeCheckout(callback));
    },
    onStripeClick: (amount: number, email: string) => {
      dispatch(openStripeOverlay(amount, email));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(StripePopUpButton);
