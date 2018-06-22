// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import Secure from 'components/secure/secure';
import { type Currency } from 'helpers/internationalisation/currency';


// ----- Types ----- //

type PropTypes = {
  contributionType: string,
  amount: number,
  currency: Currency,
};


// ----- Component ----- //

export default function YourContribution(props: PropTypes) {

  return (
    <div className="component-your-contribution">
      <PageSection heading={`Your ${props.contributionType} contribution`}>
        <PaymentAmount
          amount={props.amount}
          currency={props.currency}
        />
        <Secure />
      </PageSection>
    </div>
  );

}
