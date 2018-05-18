// @flow

// ----- Imports ----- //

import React from 'react';

import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import SvgPaypalPLogo from 'components/svgs/payPalPLogo';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { paypalContributionsRedirect } from 'helpers/payPalContributionsCheckout/payPalContributionsCheckout';
import { classNameWithModifiers } from 'helpers/utilities';
import * as storage from 'helpers/storage';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  errorHandler: (string) => void,
  canClick: boolean,
  buttonText: string,
  additionalClass: string,
  inPaymentLogosTest: boolean,
  onClick: ?(void => void),
  switchedOff: boolean,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function payWithPayPal(props: PropTypes) {
  return () => {

    if (props.onClick) {
      props.onClick();
    }

    if (props.canClick) {
      storage.setSession('paymentMethod', 'PayPal');
      paypalContributionsRedirect(
        props.amount,
        props.referrerAcquisitionData,
        props.isoCountry,
        props.countryGroupId,
        props.errorHandler,
        props.abParticipations,
      );
    }
  };
}


// ----- Component ----- //

function PayPalContributionButton(props: PropTypes) {

  return (
    <Switchable
      off={props.switchedOff}
      component={() => <Button {...props} />}
      fallback={() => <PaymentError paymentMethod="PayPal" modifierClass="paypal" />}
    />
  );

}


// ----- Auxiliary Components ----- //

function Button(props: PropTypes) {

  const modifiers = props.inPaymentLogosTest ?
    [props.additionalClass, 'variant'] :
    [props.additionalClass];

  return (
    <button
      id="qa-contribute-paypal-button"
      className={classNameWithModifiers('component-paypal-contribution-button', modifiers)}
      onClick={payWithPayPal(props)}
    >
      {props.inPaymentLogosTest ? null : <SvgPaypalPLogo />}
      <span className="component-paypal-contribution-button__text">{props.buttonText}</span>
      <SvgArrowRightStraight />
    </button>
  );

}


// ----- Default Props ----- //

/* eslint-disable react/default-props-match-prop-types */
PayPalContributionButton.defaultProps = {
  canClick: true,
  buttonText: 'Pay with PayPal',
  additionalClass: '',
  inPaymentLogosTest: false,
  onClick: null,
  switchedOff: false,
};
/* eslint-enable react/default-props-match-prop-types */


// ----- Exports ----- //

export default PayPalContributionButton;
