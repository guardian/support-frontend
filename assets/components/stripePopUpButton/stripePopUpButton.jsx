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
  dispatch: Function,
  amount: number,
  email: string,
  callback: Function,
};


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => {

  props.dispatch(setupStripeCheckout(props.callback));

  const stripeClick = () => props.dispatch(openStripeOverlay(props.amount, props.email));

  return (
    <button
      id="qa-pay-with-card"
      className="component-stripe-pop-up-button"
      onClick={stripeClick}
    >Pay with debit/credit card <Svg svgName="credit-card" /></button>
  );

};


// ----- Exports ----- //

export default connect()(StripePopUpButton);
