// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import Secure from 'components/secure/secure';

import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type ContributionType } from 'helpers/contributions';


// ----- Types ----- //

type PropTypes = {|
  contributionType: ContributionType,
  amount: number,
  currencyId: IsoCurrency,
|};


// ----- Setup ----- //

function getHeading(contributionType: ContributionType): string {

  switch (contributionType) {
    case 'ANNUAL':
      return 'Your annual contribution';
    case 'MONTHLY':
      return 'Your monthly contribution';
    case 'ONE_OFF':
    default:
      return 'Your single contribution';
  }

}


// ----- Component ----- //

export default function YourContribution(props: PropTypes) {

  return (
    <div className="component-your-contribution">
      <PageSection heading={getHeading(props.contributionType)}>
        <PaymentAmount
          amount={props.amount}
          currencyId={props.currencyId}
        />
        <Secure />
      </PageSection>
    </div>
  );

}
