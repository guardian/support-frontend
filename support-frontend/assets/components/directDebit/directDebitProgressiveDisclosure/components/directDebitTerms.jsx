// @flow

// ----- Imports ----- //
import React from 'react';

import '../directDebitForm.scss';

function DirectDebitTerms() {
  return (
    <ul className="component-direct-debit-terms">
      <li>
        <strong>Payments by GoCardless</strong> read the <a href="https://gocardless.com/privacy">GoCardless privacy notice</a>
      </li>
      <li>
        <strong>Advance notice</strong> The details of your Direct Debit instruction including
        payment schedule, due date, frequency and amount will be sent to you within three working
        days. All the normal Direct Debit safeguards and guarantees apply.
      </li>
      <li>
        <strong>Direct Debit</strong><br />
        The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch, LE65 1TJ United
        Kingdom<br />
        Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends
        (GMT/BST) contribution.support@theguardian.com
      </li>
    </ul>
  );
}

export default DirectDebitTerms;
