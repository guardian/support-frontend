// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import PageSection from 'components/pageSection/pageSection';
import DisplayName from 'components/displayName/displayName';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import ContribLegal from 'components/legal/contribLegal/contribLegal';
import Signout from 'components/signout/signout';
import { getQueryParameter } from 'helpers/url';
import { parseContrib, type Contrib } from 'helpers/contributions';
import { type IsoCountry } from 'helpers/internationalisation/country';

import YourContributionContainer from './yourContributionContainer';
import FormFields from './formFields';
import RegularContributionsPayment from './regularContributionsPayment';
import RegularInlineContributionsPayment from './regularInlineContributionsPayment';


// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  country: IsoCountry,
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
      <CirclesIntroduction headings={title[props.contributionType.toLowerCase()]} modifierClasses={['compact']} />
      <hr className="regular-contrib__multiline" />
      <YourContributionContainer contributionType={props.contributionType.toLowerCase()} />
      <PageSection
        heading="Your details"
        headingChildren={<Signout />}
      >
        <DisplayName />
        <FormFields />
      </PageSection>
      <PageSection heading={paymentSectionHeading}>
        {contributionsPayment}
      </PageSection>
      <PageSection>
        <TermsPrivacy country={props.country} />
        <ContribLegal />
      </PageSection>
    </Page>
  );
}


// ----- Exports ----- //

export default connect(mapStateToProps)(RegularContributionsPage);
