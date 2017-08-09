// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

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
    <button className={'action action--button action--button--forward'} onClick={props.payWithPayPal}>
      <svg className="action--button__arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="17.89" viewBox="0 0 20 17.89">
        <path d="M20 9.35l-9.08 8.54-.86-.81 6.54-7.31H0V8.12h16.6L10.06.81l.86-.81L20 8.51v.84zm20-.81L49.08 0l.86.81-6.54 7.31H60v1.65H43.4l6.54 7.31-.86.81L40 9.39v-.85z" />
      </svg>
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
