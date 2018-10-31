// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {|
  paymentMethod: string,
  modifierClass: string,
|};


// ----- Component ----- //

function PaymentError(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('component-payment-error', [props.modifierClass])}>
      <p className="component-payment-error__message">
        We are not able to accept {props.paymentMethod} payments at the moment.
        Please use another payment method or try again later.
      </p>
    </div>
  );
}


// ----- Default Props ----- //

PaymentError.defaultProps = {
  modifierClass: '',
};


// ----- Export ----- //

export default PaymentError;
