// @flow

import React from 'react';
import { connect } from 'react-redux';

import { openStripeOverlay, setupStripeCheckout } from 'helpers/stripeCheckout/stripeCheckoutActions';


// ----- Functions ----- //

const StripePopUpButton = (props: Props) => {

  props.setupStripeCheckout();

  return <button onClick={() => props.onStripeClick(props.amount)}>Add CC</button>;

};

function mapStateToProps(state) {

  return {
    overlayOpen: state.stripe.overlay,
    stripeLoaded: state.stripe.loaded,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    setupStripeCheckout: () => {
      dispatch(setupStripeCheckout());
    },
    onStripeClick: (amount) => {
      dispatch(openStripeOverlay(amount));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(StripePopUpButton);
