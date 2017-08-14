// @flow

// ----- Imports ----- //

import React from 'react';
import type { Currency } from 'helpers/internationalisation/currency';

// ----- Setup ----- //

const baseClass = 'component-payment-amount';
const wideModifier = 'component-payment-amount--wide';
const wideClass = 'component-payment-amount--wide-value';


// ----- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
};


// ----- Component ----- //

export default function PaymentAmount(props: PropTypes) {

  const addDecimal = props.amount % 1 > 0;
  const printedAmount = addDecimal ? props.amount.toFixed(2) : props.amount;
  const printedLength = printedAmount.toString().length;

  let className = '';

  if (printedLength <= 2) {
    className = baseClass;
  } else if (printedLength > 2 && printedLength < 8) {
    className = `${baseClass} ${wideModifier} ${wideClass}-${printedLength}`;
  } else {
    className = `${baseClass} ${wideModifier} ${wideClass}`;
  }

  return (
    <div className={className}>{props.currency.glyph}{printedAmount}</div>
  );

}
