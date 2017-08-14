// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import Svg from 'components/svg/svg';

import { payPalContributionsButtonClicked, paypalContributionsRedirect } from 'helpers/payPalContributionsCheckout/payPalContributionsCheckoutActions';


// ---- Types ----- //

type PropTypes = {
  payWithPayPal: Function,
  payPalPayClicked: boolean,
  paypalContributionsRedirect: Function,
};


// ----- Component ----- //

const PayPalContributionButton = (props: PropTypes) => {

  if (props.payPalPayClicked) {
    props.paypalContributionsRedirect();
  }

  return (
    <button className={'component-paypal-contribution-button'} onClick={props.payWithPayPal}>
      <Svg svgName="paypal-p-logo" />
      <span>contribute with PayPal</span>
      <Svg svgName="arrow-right-straight" />
    </button>);
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    payPalPayClicked: state.payPalContributionsCheckout.payPalPayClicked,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    payWithPayPal: () => {
      dispatch(payPalContributionsButtonClicked());
    },
    paypalContributionsRedirect: () => {
      dispatch(paypalContributionsRedirect());
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PayPalContributionButton);
