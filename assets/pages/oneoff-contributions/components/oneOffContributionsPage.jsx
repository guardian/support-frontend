// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import PageSection from 'components/pageSection/pageSection';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import ContribLegal from 'components/legal/contribLegal/contribLegal';
import DisplayName from 'components/displayName/displayName';
import Signout from 'components/signout/signout';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
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
    country: state.common.country,
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
      <CirclesIntroduction headings={[`Make a ${contribDescription}`, 'contribution']} modifierClasses={['compact']} />
      <hr className="oneoff-contrib__multiline" />
      <YourContributionContainer contributionType={contribDescription} />
      <PageSection
        heading="Your details"
        headingChildren={<Signout />}
      >
        <DisplayName />
        <FormFields />
      </PageSection>
      <PageSection
        heading={paymentSectionHeading}
      >
        <Payment />
      </PageSection>
      <PageSection>
        <TermsPrivacy country={props.country} />
        <ContribLegal />
      </PageSection>
    </Page>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps)(OneOffContributionsPage);
