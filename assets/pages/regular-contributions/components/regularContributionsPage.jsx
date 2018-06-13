// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import InfoSection from 'components/infoSection/infoSection';
import DisplayName from 'components/displayName/displayName';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import ContribLegal from 'components/legal/contribLegal/contribLegal';
import Signout from 'components/signout/signout';
import { getQueryParameter } from 'helpers/url';
import { parseContrib, type Contrib } from 'helpers/contributions';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type Currency } from 'helpers/internationalisation/currency';

import FormFields from './formFields';
import RegularContributionsPayment from './regularContributionsPayment';
import RegularInlineContributionsPayment from './regularInlineContributionsPayment';



// ----- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  contributionType: Contrib,
  country: IsoCountry,
  inlineCardPaymentVariant: 'notintest' | 'control' | 'inline',
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
  return {
    amount: state.page.regularContrib.amount,
    currency: state.common.currency,
    contributionType,
    country: state.common.country,
    inlineCardPaymentVariant: state.common.abParticipations.inlineCardPayment,
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
      <div className="regular-contrib">
        <InfoSection heading={`Your ${props.contributionType.toLowerCase()} contribution`} className="regular-contrib__your-contrib">
          <PaymentAmount
            amount={props.amount}
            currency={props.currency}
          />
          <Secure />
        </InfoSection>
        <InfoSection heading="Your details" headingContent={<Signout />} className="regular-contrib__your-details">
          <DisplayName />
          <FormFields />
        </InfoSection>
        <InfoSection heading={paymentSectionHeading} className="regular-contrib__payment-methods">
          {contributionsPayment}
        </InfoSection>
      </div>
      <div className="terms-privacy">
        <InfoSection className="terms-privacy__content">
          <TermsPrivacy country={props.country} />
          <ContribLegal />
        </InfoSection>
      </div>
    </Page>
  );
}


// ----- Exports ----- //

export default connect(mapStateToProps)(RegularContributionsPage);
