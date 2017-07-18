// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import {
  setupPayPalExpressCheckout,
} from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';


// ---- Types ----- //

type PropTypes = {
  payPalLoaded: boolean,
  setupPayPalCheckout: Function,
  callback: Function,
};


// ----- Component ----- //

const PayPalExpressButton = (props: PropTypes) => {

  if (!props.payPalLoaded) {
    props.setupPayPalCheckout(props.callback);
  }
  return (<div id="component-paypal-button-checkout" className="component-paypal-button-checkout" />);
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    // overlayOpen: state.stripeCheckout.overlay,
    payPalLoaded: state.payPalExpressCheckout.loaded,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    setupPayPalCheckout: () => {
      dispatch(setupPayPalExpressCheckout());
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PayPalExpressButton);
