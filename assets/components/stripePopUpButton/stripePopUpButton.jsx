// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
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
      id="qa-pay-with-card"
      className="component-stripe-pop-up-button"
      onClick={stripeClick}
    >Pay with debit/credit card <Svg svgName="credit-card" /></button>
  );

};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    overlayOpen: state.page.stripeCheckout.overlay,
    stripeLoaded: state.page.stripeCheckout.loaded,
    amount: state.page.stripeCheckout.amount,
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
