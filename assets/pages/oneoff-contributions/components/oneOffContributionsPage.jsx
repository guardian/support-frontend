// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import PageSection from 'components/pageSection/pageSection';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import YourDetails from 'components/yourDetails/yourDetails';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import LegalSectionContainer from 'components/legal/legalSection/legalSectionContainer';
import type { IsoCountry } from 'helpers/internationalisation/country';

import YourContributionContainer from './yourContributionContainer';
import OneoffContributionsPayment from './oneoffContributionsPayment';
import OneoffInlineContributionsPayment from './oneoffInlineContributionsPayment';
import FormFields from './formFields';


// ----- Types ----- //

type PropTypes = {
  country: IsoCountry,
  inlineCardPaymentVariant: 'notintest' | 'control' | 'inline',
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    country: state.common.internationalisation.countryId,
    inlineCardPaymentVariant: state.common.abParticipations.inlineStripeFlowCardPayment,
  };
}


// ----- Render ----- //

function OneOffContributionsPage(props: PropTypes) {
  const contribDescription: string = (props.country === 'US' ? 'one-time' : 'one-off');

  const paymentSectionHeading = props.inlineCardPaymentVariant === 'inline' ? 'Payment' : 'Payment methods';
  const Payment = props.inlineCardPaymentVariant === 'inline' ? OneoffInlineContributionsPayment : OneoffContributionsPayment;

  return (
    <Page
      header={[<TestUserBanner />, <SimpleHeader />]}
      footer={<Footer />}
    >
      <CirclesIntroduction
        headings={[`Make a ${contribDescription}`, 'contribution']}
        modifierClasses={['compact']}
      />
      <YourContributionContainer contributionType={contribDescription} />
      <YourDetails>
        <FormFields />
      </YourDetails>
      <PageSection heading={paymentSectionHeading} modifierClass="payment-methods">
        <Payment />
      </PageSection>
      <LegalSectionContainer />
    </Page>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps)(OneOffContributionsPage);
