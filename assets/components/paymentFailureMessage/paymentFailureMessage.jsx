// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { appropriateErrorMessage, type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { classNameWithModifiers } from 'helpers/utilities';
import SvgExclamationAlternate from '../svgs/exclamationAlternate';


// ---- Types ----- //

type PropTypes = {|
  checkoutFailureReason: ?CheckoutFailureReason,
  errorHeading: string,
  svg: Node,
  classModifiers: Array<?string>
|};


// ----- Component ----- //

export default function PaymentFailureMessage(props: PropTypes) {

  if (props.checkoutFailureReason) {

    return (
      <div className={classNameWithModifiers('component-payment-failure-message', props.classModifiers)}>
        {props.svg}<span className="component-payment-failure-message__error-heading">{props.errorHeading}</span>
        <span className="component-payment-failure-message__small-print">{appropriateErrorMessage(props.checkoutFailureReason)}</span>
      </div>
    );

  }

  return null;

}


// ----- Default Props ----- //

PaymentFailureMessage.defaultProps = {
  errorHeading: 'Payment Attempt Failed',
  svg: <SvgExclamationAlternate />,
  classModifiers: [],
};
