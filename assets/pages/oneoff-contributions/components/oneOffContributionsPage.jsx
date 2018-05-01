// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

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
import FormFields from './formFields';

// ----- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  country: IsoCountry,
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    amount: state.page.oneoffContrib.amount,
    currency: state.common.currency,
    country: state.common.country,
  };
}

// ----- Render ----- //

function OneOffContributionsPage(props: PropTypes) {
  const contribDescription: string = (props.country === 'US' ? 'one-time' : 'one-off');
  return (
    <div className="gu-content">
      <TestUserBanner />
      <SimpleHeader />
      <CirclesIntroduction headings={[`Make a ${contribDescription}`, 'contribution']} />
      <hr className="oneoff-contrib__multiline" />
      <div className="oneoff-contrib gu-content-margin">
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
        <InfoSection heading="Payment methods" className="oneoff-contrib__payment-methods">
          <OneoffContributionsPayment />
        </InfoSection>
      </div>
      <div className="terms-privacy gu-content-filler">
        <InfoSection className="terms-privacy__content gu-content-filler__inner">
          <TermsPrivacy country={props.country} />
          <ContribLegal />
        </InfoSection>
      </div>
      <Footer />
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps)(OneOffContributionsPage);
