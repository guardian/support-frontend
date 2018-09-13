// @flow

// ----- Imports ----- //

import React from 'react';
import type { Node } from 'react';
import SvgExclamationAlternate from '../svgs/exclamationAlternate';


// ---- Types ----- //

type PropTypes = {
  showError?: boolean,
  message: ?string,
  errorHeading: string,
  svg: Node,
};


// ----- Component ----- //

export default function PaymentFailureMessage(props: PropTypes) {

  if (props.showError && props.message) {

    return (
      <div className="component-payment-failure-message">
        {props.svg}<span className="component-payment-failure-message__error-message">{props.errorHeading}</span>
        <span className="component-payment-failure-message__small-print">{props.message}</span>
      </div>
    );

  }

  return null;

}


// ----- Default Props ----- //

PaymentFailureMessage.defaultProps = {
  showError: true,
  errorHeading: 'Payment Attempt Failed',
  svg: <SvgExclamationAlternate />,
};
