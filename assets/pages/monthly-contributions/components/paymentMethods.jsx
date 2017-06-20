// @flow

// ----- Imports ----- //

import React from 'react';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import postCheckout from '../helpers/ajax';

type PropTypes = {
    email: string,
}

// ----- Component ----- //

function PaymentMethods(props: PropTypes) {

  return (
    <section className="payment-methods">
      <StripePopUpButton email={props.email} callback={postCheckout} />
    </section>
  );

}


// ----- Exports ----- //

export default PaymentMethods;
