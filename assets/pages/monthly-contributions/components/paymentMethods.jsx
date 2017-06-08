// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';


// ----- Component ----- //

function PaymentMethods() {

  return (
    <section className="payment-methods">
      <h2>Payment methods</h2>
      <StripePopUpButton />
      <button>PayPal</button>
    </section>
  );

}


// ----- Exports ----- //

export default PaymentMethods;
