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
};


// ----- Functions ----- //

const StripePopUpButton = (props: PropTypes) => {

  if (!props.stripeLoaded) {
    props.setupStripeCheckout();
  }

  return <button onClick={props.onStripeClick}>Add CC</button>;

};

function mapStateToProps(state) {

  return {
    overlayOpen: state.stripeCheckout.overlay,
    stripeLoaded: state.stripeCheckout.loaded,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    setupStripeCheckout: () => {
      dispatch(setupStripeCheckout());
    },
    onStripeClick: () => {
      dispatch(openStripeOverlay());
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(StripePopUpButton);
