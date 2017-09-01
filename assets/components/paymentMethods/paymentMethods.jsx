// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

export type PayPalButtonType =
  'ExpressCheckout' |
  'ContributionsCheckout' |
  'NotSet';


type PropTypes = {
  email: string,
  hide: boolean,
  error: ?string,
  payPalType: PayPalButtonType,
  stripeCallback: Function,
  payPalCallback: Function,
  amount: string,
  intCmp?: string,
  refpvid?: string,
  isoCountry: IsoCountry,
  payPalErrorHandler: (string) => void,
};


// ----- Component ----- //

export default function PaymentMethods(props: PropTypes) {

  let errorMessage = '';
  let stripeButton = <StripePopUpButton email={props.email} callback={props.stripeCallback} />;
  let payPalButton = '';

  switch (props.payPalType) {
    case 'ExpressCheckout':
      payPalButton = <PayPalExpressButton callback={props.payPalCallback} />;
      break;
    case 'ContributionsCheckout':
      payPalButton = (<PayPalContributionButton
        amount={props.amount}
        intCmp={props.intCmp}
        refpvid={props.refpvid}
        isoCountry={props.isoCountry}
        errorHandler={props.payPalErrorHandler}
      />);
      break;
    default:
      payPalButton = '';
      break;
  }

  if (props.hide) {
    errorMessage = <ErrorMessage message={'Please fill in all the fields above.'} />;
    stripeButton = '';
    payPalButton = '';
  } else if (props.error !== null) {
    errorMessage = <ErrorMessage message={'There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'} />;
  }

  return (
    <section className="payment-methods">
      {errorMessage}
      {stripeButton}
      {payPalButton}
    </section>
  );
}

PaymentMethods.defaultProps = {
  intCmp: null,
  refpvid: null,
};
