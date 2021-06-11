// @flow

// ----- Imports ----- //

import React from 'react';
import { type PaymentMethod } from 'helpers/forms/paymentMethods';

// ---- Types ----- //

type PropTypes = {|
  paymentMethod: PaymentMethod,
|};

// ----- Component ----- //

function SepaTerms(props: PropTypes) {
  return (
    <>
      <div className="component-terms-privacy">
        {props.paymentMethod === 'Sepa' ? (
          <div className="component-terms-privacy__change">
            <br />
            By proceeding, you authorise Guardian News & Media Ltd and Stripe, our payment provider, to instruct your
            bank to debit your account.
            <strong>
              You’re entitled to a refund from your bank under their T&Cs, which must be claimed within 8 weeks of the
              first payment.
            </strong>
          </div>
        ) : null}
      </div>
    </>
  );
}

// ----- Exports ----- //

export default SepaTerms;
