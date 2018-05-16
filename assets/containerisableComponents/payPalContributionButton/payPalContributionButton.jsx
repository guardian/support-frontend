// @flow

// ----- Imports ----- //

import React from 'react';
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

type Switch = 'Hide' | 'HideWithError' | 'Show';

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  errorHandler: (string) => void,
  canClick?: boolean,
  buttonText?: string,
  additionalClass?: string,
  inPaymentLogosTest?: boolean,
  onClick?: ?(void => void),
  switch?: Switch,
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

  if (props.switch === 'Hide') {
    return null;
  } else if (props.switch === 'HideWithError') {
    return <ErrorMessage />;
  }

  return <Button {...props} />;

}


// ----- Auxiliary Components ----- //

function ErrorMessage() {
  return (
    <div className="component-paypal-contribution-buttonr">
      <p className="component-paypal-contribution-button__error-message">
        We are currently experiencing issues with credit/debit card payments.
        Please use another payment method or try again later.
      </p>
    </div>
  );
}

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

PayPalContributionButton.defaultProps = {
  canClick: true,
  buttonText: 'Pay with PayPal',
  additionalClass: '',
  inPaymentLogosTest: false,
  onClick: null,
  switch: 'Show',
};


// ----- Exports ----- //

export default PayPalContributionButton;
