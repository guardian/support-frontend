// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';

import {
  paypalContributionsRedirect,
} from 'helpers/payPalContributionsCheckout/payPalContributionsCheckout';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: string,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  isoCountry: IsoCountry,
  errorHandler: (string) => void,
  canClick?: boolean,
  buttonText?: string,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function payWithPayPal(props: PropTypes) {
  return () => {
    if (props.canClick) {
      paypalContributionsRedirect(
        Number(props.amount),
        props.referrerAcquisitionData,
        props.isoCountry,
        props.errorHandler,
        props.abParticipations);
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
      <span>{props.buttonText}</span>
      <Svg svgName="arrow-right-straight" />
    </button>
  );


// ----- Default Props ----- //

PayPalContributionButton.defaultProps = {
  canClick: true,
  buttonText: 'Pay with PayPal',
};


// ----- Exports ----- //

export default PayPalContributionButton;
