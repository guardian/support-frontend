// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgPaypalPLogo, SvgArrowRightStraight } from 'components/svg/svg';

import {
  paypalContributionsRedirect,
} from 'helpers/payPalContributionsCheckout/payPalContributionsCheckout';
import { generateClassName } from 'helpers/utilities';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  isoCountry: IsoCountry,
  errorHandler: (string) => void,
  canClick?: boolean,
  buttonText?: string,
  additionalClass?: string,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function payWithPayPal(props: PropTypes) {
  return () => {
    if (props.canClick) {
      paypalContributionsRedirect(
        props.amount,
        props.referrerAcquisitionData,
        props.isoCountry,
        props.errorHandler,
        props.abParticipations,
      );
    }
  };
}


// ----- Component ----- //

const PayPalContributionButton = (props: PropTypes) =>
  (
    <button
      id="qa-contribute-paypal-button"
      className={generateClassName('component-paypal-contribution-button', props.additionalClass || '')}
      onClick={payWithPayPal(props)}
    >

      <SvgPaypalPLogo />
      <span>{props.buttonText}</span>
      <SvgArrowRightStraight />
    </button>
  );


// ----- Default Props ----- //

PayPalContributionButton.defaultProps = {
  canClick: true,
  buttonText: 'Pay with PayPal',
  additionalClass: '',
};


// ----- Exports ----- //

export default PayPalContributionButton;
