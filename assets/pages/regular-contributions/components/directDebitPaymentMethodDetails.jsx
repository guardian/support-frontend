// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import SvgDirectDebitSymbolAndText from 'components/svgs/directDebitSymbolAndText';

type PropTypes = {
  accountHolderName: string,
  accountNumber: string,
  sortCodeArray: string[],
}

function mask(s: string): string {
  return `******${s.substring(6)}`;
}

export default function DirectDebitPaymentMethodDetails(props: PropTypes) {
  return (
    <div className="component-direct-debit-confirmation">
      <PageSection modifierClass="email-confirmation" heading="Your contribution">
        <SvgDirectDebitSymbolAndText />
        <p className="component-email-confirmation__copy component-email-confirmation__copy--with-dd">
          Look out for an email confirming your recurring payment.
        </p>
        <ul className="component-direct-debit-confirmation__details">
          <DirectDebitItem name="Payment Method:" value="Direct Debit" />
          <DirectDebitItem name="Account Name:" value={props.accountHolderName} />
          <DirectDebitItem name="Account number:" value={mask(props.accountNumber)} />
          <DirectDebitItem name="Sort Code:" value={`${props.sortCodeArray[0]}-${props.sortCodeArray[1]}-${props.sortCodeArray[2]}`} />
        </ul>
      </PageSection>
    </div>
  );
}

function DirectDebitItem(props: {name: string, value: string}) {
  return (
    <li className="component-direct-debit-confirmation__item">
      <div className="component-direct-debit-confirmation__item-name">{props.name}</div>
      <div className="component-direct-debit-confirmation__item-value">{props.value}</div>
    </li>
  );
}
