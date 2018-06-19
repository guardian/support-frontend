// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import InfoSection from 'components/infoSection/infoSection';
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import PaymentAmount from 'components/paymentAmount/paymentAmount';
import ContribLegal from 'components/legal/contribLegal/contribLegal';
import DisplayName from 'components/displayName/displayName';
import Signout from 'components/signout/signout';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';

import OneoffContributionsPayment from './oneoffContributionsPayment';
import OneoffInlineContributionsPayment from './oneoffInlineContributionsPayment';
import FormFields from './formFields';

// ----- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  country: IsoCountry,
  inlineCardPaymentVariant: 'notintest' | 'control' | 'inline',
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    amount: state.page.oneoffContrib.amount,
    currency: state.common.currency,
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
      <div className="oneoff-contrib">
        <InfoSection heading={`Your ${contribDescription} contribution`} className="oneoff-contrib__your-contrib">
          <PaymentAmount
            amount={props.amount}
            currency={props.currency}
          />
          <Secure />
        </InfoSection>
        <InfoSection heading="Your details" headingContent={<Signout />} className="oneoff-contrib__your-details">
          <DisplayName />
          <FormFields />
        </InfoSection>
        <InfoSection heading={paymentSectionHeading} className="oneoff-contrib__payment-methods">
          <Payment />
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

export default connect(mapStateToProps)(OneOffContributionsPage);
