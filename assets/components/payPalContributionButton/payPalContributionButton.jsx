// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { paypalContributionsRedirect } from 'helpers/payPalContributionsCheckout/payPalContributionsCheckout';


// ---- Types ----- //

type PropTypes = {
  amount: string,
  intCmp?: string,
  isoCountry: IsoCountry,
  errorHandler: (string) => void,
};

function payWithPayPal(props: PropTypes) {
  return () => {
    paypalContributionsRedirect(
      Number(props.amount),
      props.intCmp,
      props.isoCountry,
      props.errorHandler);
  };
}

// ----- Component ----- //

const PayPalContributionButton = (props: PropTypes) =>
  (
    <button className={'component-paypal-contribution-button'} onClick={payWithPayPal(props)}>
      <Svg svgName="paypal-p-logo" />
      <span>contribute with PayPal</span>
      <Svg svgName="arrow-right-straight" />
    </button>
  );


// ----- Defaults ----- //

PayPalContributionButton.defaultProps = {
  intCmp: null,
};


// ----- Exports ----- //

export default PayPalContributionButton;
