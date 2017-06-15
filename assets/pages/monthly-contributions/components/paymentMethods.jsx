// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import postCheckout from '../helpers/ajax';


// ----- Component ----- //

function PaymentMethods() {

  return (
    <section className="payment-methods">
      <StripePopUpButton callback={postCheckout} />
    </section>
  );

}


// ----- Exports ----- //

export default PaymentMethods;
