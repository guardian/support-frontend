// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';


// ----- Component ----- //

function PaymentMethods() {

  return (
    <section className="payment-methods">
      <StripePopUpButton />
    </section>
  );

}


// ----- Exports ----- //

export default PaymentMethods;
