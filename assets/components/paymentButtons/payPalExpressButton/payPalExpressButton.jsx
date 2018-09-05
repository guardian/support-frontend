// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';

import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { loadPayPalExpress, setup } from 'helpers/paymentIntegrations/payPalExpressCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ---- Types ----- //

type PropTypes = {|
  amount: number,
  callback: (token: string) => Promise<*>,
  csrf: CsrfState,
  currencyId: IsoCurrency,
  hasLoaded: boolean,
  setHasLoaded: () => void,
  switchStatus: Status,
  disable: boolean,
|};


// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {

  return (
    <Switchable
      status={props.switchStatus}
      component={() => <Button {...props} />}
      fallback={() => <PaymentError paymentMethod="PayPal" modifierClass="paypal-express" />}
    />
  );

}

// ----- Auxiliary Components ----- //

function Button(props: PropTypes) {

  if (!props.hasLoaded) {
    loadPayPalExpress().then(props.setHasLoaded);
    return null;
  }

  const payPalOptions = setup(
    props.amount,
    props.currencyId,
    props.csrf,
    props.callback,
  );

  const disabledButton = (
    <button
      className="component-paypal-button-checkout__disabled-pop-up-button"
      disabled
    >
      Pay with PayPal
      <SvgArrowRightStraight />
    </button>
  );


  const ActiveButton = window.paypal.Button.driver('react', { React, ReactDOM });

  return (
    <div id="component-paypal-button-checkout" className="component-paypal-button-checkout">
      { props.disable ? disabledButton : <ActiveButton {...payPalOptions} /> }
    </div>
  );
}


// ----- Default Props ----- //

PayPalExpressButton.defaultProps = {
  switchStatus: 'On',
};


// ----- Export ----- //

export default PayPalExpressButton;
