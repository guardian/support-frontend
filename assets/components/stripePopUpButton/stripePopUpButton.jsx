//@flow

import React from 'react';

import * as stripeCheckout from 'helpers/stripeCheckout/stripeCheckout';
import { openStripeOverlay, setupStripeCheckout } from 'helpers/stripeCheckout/stripeCheckoutActions';

import { connect } from 'react-redux';


// ----- Functions ----- //

const StripePopUpButton = (props : Props) => {

  props.setupStripeCheckout();

  console.log("render");
  return (
    <div>
      {( props.loading || props.stripeLoading )
        ? <p>loading..</p>
        : <button onClick={props.onStripeClick}>Add CC</button>
      }
    </div>
  );
};

function mapStateToProps(state) {

  return {
    stripeLoading: state.stripe.loading,
    loading: state
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
  }

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(StripePopUpButton);
