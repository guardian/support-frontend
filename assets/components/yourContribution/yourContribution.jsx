// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import Secure from 'components/secure/secure';

import { type Currency } from 'helpers/internationalisation/currency';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type Contrib as ContributionType } from 'helpers/contributions';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  country: IsoCountry,
  amount: number,
  currency: Currency,
};


// ----- Setup ----- //

function getHeading(
  contributionType: ContributionType,
  country: IsoCountry,
): string {

  switch (contributionType) {
    case 'ANNUAL':
      return 'Your annual contribution';
    case 'MONTHLY':
      return 'Your monthly contribution';
    case 'ONE_OFF':
    default:
      return `Your ${country === 'US' ? 'one-time' : 'one-off'} contribution`;
  }

}


// ----- Component ----- //

export default function YourContribution(props: PropTypes) {

  return (
    <div className="component-your-contribution">
      <PageSection heading={getHeading(props.contributionType, props.country)}>
        <PaymentAmount
          amount={props.amount}
          currency={props.currency}
        />
        <Secure />
      </PageSection>
    </div>
  );

}
