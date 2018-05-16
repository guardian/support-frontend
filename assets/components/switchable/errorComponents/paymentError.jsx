// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  paymentMethod: string,
};


// ----- Component ----- //

export default function PaymentError(props: PropTypes) {
  return (
    <div className="component-payment-error">
      <p className="component-payment-error__message">
        We are currently experiencing issues with {props.paymentMethod} payments.
        Please use another payment method or try again later.
      </p>
    </div>
  );
}
