// @flow

// ----- Imports ----- //

import React, { type ComponentType } from 'react';

import Page from 'components/page/page';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import YourContribution from 'components/yourContribution/yourContribution';
import YourDetails from 'components/yourDetails/yourDetails';
import PageSection from 'components/pageSection/pageSection';
import LegalSectionContainer from 'components/legal/legalSection/legalSectionContainer';

import { type Contrib as ContributionType } from 'helpers/contributions';
import { type Currency } from 'helpers/internationalisation/currency';
import { type IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  country: IsoCountry,
  contributionType: ContributionType,
  inlineCardPaymentVariant: 'notintest' | 'control' | 'inline',
  form: ComponentType<*>,
  payment: ComponentType<*>,
};


// ----- Functions ----- //

function getTitle(cT: ContributionType, c: IsoCountry): string {

  switch (cT) {
    case 'ANNUAL':
      return 'Make an annual';
    case 'MONTHLY':
      return 'Make a monthly';
    case 'ONE_OFF':
    default:
      return `Make a ${c === 'US' ? 'one-time' : 'one-off'}`;
  }

}


// ----- Component ----- //

export default function ContributionsCheckout(props: PropTypes) {

  const paymentSectionHeading = props.inlineCardPaymentVariant === 'inline' ?
    'Payment' :
    'Payment methods';

  const Form = props.form;
  const Payment = props.payment;

  return (
    <Page
      header={[<TestUserBanner />, <SimpleHeader />]}
      footer={<Footer />}
    >
      <CirclesIntroduction
        headings={[getTitle(props.contributionType, props.country), 'contribution']}
        modifierClasses={['compact']}
      />
      <YourContribution
        contributionType={props.contributionType}
        country={props.country}
        amount={props.amount}
        currency={props.currency}
      />
      <YourDetails>
        <Form />
      </YourDetails>
      <PageSection heading={paymentSectionHeading} modifierClass="payment-methods">
        <Payment />
      </PageSection>
      <LegalSectionContainer />
    </Page>
  );

}
