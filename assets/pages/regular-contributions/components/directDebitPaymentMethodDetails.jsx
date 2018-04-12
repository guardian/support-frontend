// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';

function mask(s: String): String {
  return `******${s.substring(6)}`;
}

export default function DirectDebitPaymentMethodDetails(props: Object) {
  return (
    <div className="component-direct-debit-confirmation">
      <PageSection modifierClass="email-confirmation">
        <ul className="component-direct-debit-confirmation__details">
          <li className="component-direct-debit-confirmation__details__item">
            <div className="component-direct-debit-confirmation__details__item-name">Payment Method:</div>
            <div className="component-direct-debit-confirmation__details__item-value">Direct Debit</div>
          </li>
          <li className="component-direct-debit-confirmation__details__item">
            <div className="component-direct-debit-confirmation__details__item-name">Account Name:</div>
            <div className="component-direct-debit-confirmation__details__item-value">{props.accountHolderName}</div>
          </li>
          <li className="component-direct-debit-confirmation__details__item">
            <div className="component-direct-debit-confirmation__details__item-name">Account number:</div>
            <div className="component-direct-debit-confirmation__details__item-value">{mask(props.accountNumber)}</div>
          </li>
          <li className="component-direct-debit-confirmation__details__item">
            <div className="component-direct-debit-confirmation__details__item-name">Sort Code:</div>
            <div className="component-direct-debit-confirmation__details__item-value">{props.sortCodeArray[0]}-{props.sortCodeArray[1]}-{props.sortCodeArray[2]}</div>
          </li>
        </ul>
      </PageSection>
    </div>
  );
}
