// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import {
  setupPayPalExpressCheckout,
} from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';


// ---- Types ----- //

type PropTypes = {
  setupPayPalCheckout: Function,
  callback: Function,
};

function isPayPalSetup(): boolean {
  return window.paypal !== undefined;
}


// ----- Component ----- //

const PayPalExpressButton = (props: PropTypes) => {
  if (!isPayPalSetup()) {
    props.setupPayPalCheckout(props.callback);
    return <div id="component-paypal-button-checkout" className="component-paypal-button-checkout" />;
  }
};


// ----- Map State/Props ----- //

function mapDispatchToProps(dispatch) {

  return {
    setupPayPalCheckout: (callback: Function) => {
      dispatch(setupPayPalExpressCheckout(callback));
    },
  };

}


// ----- Exports ----- //

export default connect(undefined, mapDispatchToProps)(PayPalExpressButton);
