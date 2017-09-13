// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { paypalContributionsRedirect } from 'helpers/payPalContributionsCheckout/payPalContributionsCheckout';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: string,
  intCmp?: string,
  refpvid?: string,
  isoCountry: IsoCountry,
  errorHandler: (string) => void,
  canClick?: boolean,
};
/* eslint-enable react/no-unused-prop-types */

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
      <span>contribute with PayPal</span>
      <Svg svgName="arrow-right-straight" />
    </button>
  );


// ----- Defaults ----- //

PayPalContributionButton.defaultProps = {
  intCmp: null,
  refpvid: null,
  canClick: true,
};


// ----- Exports ----- //

export default PayPalContributionButton;
