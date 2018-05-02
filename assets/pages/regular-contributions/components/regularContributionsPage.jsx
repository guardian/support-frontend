// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

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

import FormFields from './formFields';
import RegularContributionsPayment from './regularContributionsPayment';
import type { Currency } from '../../../helpers/internationalisation/currency';

// ----- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  contributionType: Contrib,
  country: IsoCountry,
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const contributionType = parseContrib(getQueryParameter('contribType'), 'MONTHLY');
  return {
    amount: state.page.regularContrib.amount,
    currency: state.common.currency,
    contributionType,
    country: state.common.country,
  };
}

// ----- Page Startup ----- //

const title = {
  annual: ['Make an annual', 'contribution'],
  monthly: ['Make a monthly', 'contribution'],
};

// ----- Render ----- //

function RegularContributionsPage(props: PropTypes) {
  return (
    <div className="gu-content">
      <TestUserBanner />
      <SimpleHeader />
      <CirclesIntroduction headings={title[props.contributionType.toLowerCase()]} />
      <hr className="regular-contrib__multiline" />
      <div className="regular-contrib gu-content-margin">
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
        <InfoSection heading="Payment methods" className="regular-contrib__payment-methods">
          <RegularContributionsPayment contributionType={props.contributionType} />
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

export default connect(mapStateToProps)(RegularContributionsPage);
