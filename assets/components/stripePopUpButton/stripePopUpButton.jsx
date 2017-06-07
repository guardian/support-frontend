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
};


// ----- Functions ----- //

const StripePopUpButton = (props: PropTypes) => {

  if (!props.stripeLoaded) {
    props.setupStripeCheckout();
  }

  const stripeClick = () => props.onStripeClick(props.amount, props.email);

  return <button onClick={stripeClick}>Add CC</button>;

};

function mapStateToProps(state) {

  return {
    overlayOpen: state.stripeCheckout.overlay,
    stripeLoaded: state.stripeCheckout.loaded,
    amount: state.stripeCheckout.amount,
    email: 'notarealuser@gu.com',
  };

}

function mapDispatchToProps(dispatch) {

  return {
    setupStripeCheckout: () => {
      dispatch(setupStripeCheckout());
    },
    onStripeClick: (amount: number, email: string) => {
      dispatch(openStripeOverlay(amount, email));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(StripePopUpButton);
