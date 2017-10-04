// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';

import {
  paypalContributionsRedirect,
} from 'helpers/payPalContributionsCheckout/payPalContributionsCheckout';

import type { IsoCountry } from 'helpers/internationalisation/country';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: string,
  intCmp?: ?string,
  refpvid?: ?string,
  isoCountry: IsoCountry,
  errorHandler: (string) => void,
  canClick?: boolean,
  copy?: string,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function payWithPayPal(props: PropTypes) {
  return () => {
    if (props.canClick) {
      paypalContributionsRedirect(
        Number(props.amount),
        props.intCmp,
        props.refpvid,
        props.isoCountry,
        props.errorHandler);
    }
  };
}


// ----- Component ----- //

const PayPalContributionButton = (props: PropTypes) =>
  (
    <button
      id="qa-contribute-paypal-button"
      className="component-paypal-contribution-button"
      onClick={payWithPayPal(props)}
    >

      <Svg svgName="paypal-p-logo" />
      <span>{props.copy}</span>
      <Svg svgName="arrow-right-straight" />
    </button>
  );


// ----- Default Props ----- //

PayPalContributionButton.defaultProps = {
  intCmp: null,
  refpvid: null,
  canClick: true,
  copy: 'Pay with PayPal',
};


// ----- Exports ----- //

export default PayPalContributionButton;
