// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Setup ----- //

const terms = <a href="https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions">Terms and Conditions</a>;
const privacy = <a href="http://www.theguardian.com/help/privacy-policy">Privacy Policy</a>;


// ----- Component ----- //

function PaymentMethods() {

  return (
    <section className="payment-methods">
      <h2>Payment methods</h2>
      <button>Stripe</button>
      <button>PayPal</button>
      <div>
        By proceeding, you are agreeing to our {terms} and {privacy}.
      </div>
    </section>
  );

}


// ----- Exports ----- //

export default PaymentMethods;
