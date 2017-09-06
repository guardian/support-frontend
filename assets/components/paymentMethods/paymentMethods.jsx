// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import ProgressMessage from 'components/progressMessage/progressMessage';
import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

export type PayPalButtonType =
  'ExpressCheckout' |
  'ContributionsCheckout' |
  'NotSet';

export type PaymentStatus = 'NotStarted' | 'Pending' | 'Failed';

type PropTypes = {
  email: string,
  hide: boolean,
  error: ?string,
  payPalType: PayPalButtonType,
  stripeCallback: Function,
  payPalCallback: Function,
  paymentStatus: PaymentStatus,
  amount: string,
  intCmp?: string,
  refpvid?: string,
  isoCountry: IsoCountry,
  payPalErrorHandler: (string) => void,
};


// ----- Component ----- //

export default function PaymentMethods(props: PropTypes) {

  let statusMessage = '';
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

  if (props.paymentStatus === 'Pending') {
    statusMessage = <ProgressMessage message={['Processing transaction', 'Please wait']} />;
  } else if (props.hide) {
    statusMessage = <ErrorMessage message={'Please fill in all the fields above.'} />;
    stripeButton = '';
    payPalButton = '';
  } else if (props.error !== null && props.error !== undefined) {
    statusMessage = <ErrorMessage message={props.error} />;
  }

  return (
    <section className="payment-methods">
      {statusMessage}
      {stripeButton}
      {payPalButton}
    </section>
  );
}

PaymentMethods.defaultProps = {
  intCmp: null,
  refpvid: null,
};
