// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import PageSection from 'components/pageSection/pageSection';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import YourDetails from 'components/yourDetails/yourDetails';
import LegalSectionContainer from 'components/legal/legalSection/legalSectionContainer';
import { getQueryParameter } from 'helpers/url';
import { parseContrib, type Contrib } from 'helpers/contributions';

import YourContributionContainer from './yourContributionContainer';
import FormFields from './formFields';
import RegularContributionsPayment from './regularContributionsPayment';
import RegularInlineContributionsPayment from './regularInlineContributionsPayment';


// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  inlineCardPaymentVariant: 'notintest' | 'control' | 'inline',
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
  return {
    contributionType,
    country: state.common.country,
    inlineCardPaymentVariant: state.common.abParticipations.inlineStripeFlowCardPayment,
  };
}


// ----- Page Startup ----- //

const title = {
  annual: ['Make an annual', 'contribution'],
  monthly: ['Make a monthly', 'contribution'],
};


// ----- Render ----- //

function RegularContributionsPage(props: PropTypes) {

  const paymentSectionHeading = props.inlineCardPaymentVariant === 'inline' ? 'Payment' : 'Payment methods';
  const contributionsPayment = props.inlineCardPaymentVariant === 'inline' ? <RegularInlineContributionsPayment contributionType={props.contributionType} /> : <RegularContributionsPayment contributionType={props.contributionType} />;

  return (
    <Page
      header={[<TestUserBanner />, <SimpleHeader />]}
      footer={<Footer />}
    >
      <CirclesIntroduction
        headings={title[props.contributionType.toLowerCase()]}
        modifierClasses={['compact']}
      />
      <hr className="regular-contrib__multiline" />
      <YourContributionContainer
        contributionType={props.contributionType.toLowerCase()}
      />
      <YourDetails>
        <FormFields />
      </YourDetails>
      <PageSection heading={paymentSectionHeading}>
        {contributionsPayment}
      </PageSection>
      <LegalSectionContainer />
    </Page>
  );
}


// ----- Exports ----- //

export default connect(mapStateToProps)(RegularContributionsPage);
