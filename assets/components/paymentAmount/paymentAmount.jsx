// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Setup ----- //

const wideClass = 'component-payment-amount--wide-value';


// ----- Types ----- //

type PropTypes = {
  amount: number,
};


// ----- Component ----- //

export default function PaymentAmount(props: PropTypes) {

  const wideValue = props.amount.toString().length > 2;
  const className = `component-payment-amount ${wideValue ? wideClass : ''}`;
  const printedAmount = wideValue ? props.amount.toFixed(2) : props.amount;

  return (
    <div className={className}>£{printedAmount}</div>
  );

}
