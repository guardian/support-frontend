// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import Page from 'components/page/page';
import TestUserBanner from 'components/testUserBanner/testUserBanner';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import YourContribution from 'components/yourContribution/yourContribution';
import YourDetails from 'components/yourDetails/yourDetails';
import PageSection from 'components/pageSection/pageSection';
import LegalSectionContainer from 'components/legal/legalSection/legalSectionContainer';
import CtaLink from 'components/ctaLink/ctaLink';
import { type Contrib as ContributionType } from 'helpers/contributions';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { getTitle } from 'helpers/checkoutForm/checkoutForm';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { Contrib } from 'helpers/contributions';
import { type Stage } from '../helpers/checkoutForm/checkoutFormReducer';

// ----- Types ----- //

type PropTypes = {|
  amount: number,
  currencyId: IsoCurrency,
  contributionType: ContributionType,
  displayName: string,
  isSignedIn: boolean,
  form: Node,
  payment: Node,
  onNextButtonClick: (string, boolean, UserTypeFromIdentityResponse) => void,
  onBackClick: () => void,
  stage: Stage,
  contributionType: Contrib,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
|};

// ----- Component ----- //


export default function ContributionsCheckout(props: PropTypes) {

  const checkoutStage = () => {
    switch (props.stage) {

      case 'payment':
        return (
          <PageSection heading="Payment methods" modifierClass="payment-methods">
            {props.payment}
            <CtaLink
              text="Back to your details"
              accessibilityHint="back"
              id="qa-back-button"
              onClick={props.onBackClick}
              modifierClasses={['form-navigation', 'back']}
            />
          </PageSection>
        );

      case 'checkout':
      default:
        return (
          <YourDetails
            name={props.displayName}
            isSignedIn={props.isSignedIn}
          >
            <div>
              {props.form}
              <CtaLink
                text="Continue to payment"
                accessibilityHint="Continue to payment"
                id="qa-contribute-button"
                onClick={
                  () => props.onNextButtonClick(
                    props.contributionType,
                    props.isSignedIn,
                    props.userTypeFromIdentityResponse,
                  )
                }
                modifierClasses={['form-navigation', 'continue']}
              />
            </div>
          </YourDetails>
        );


    }
  };


  return (
    <div className="component-contributions-checkout">
      <Page
        header={[<TestUserBanner />, <SimpleHeader />]}
        footer={<Footer />}
      >
        <CirclesIntroduction
          headings={[getTitle(props.contributionType), 'contribution']}
          modifierClasses={['compact']}
        />
        <YourContribution
          contributionType={props.contributionType}
          amount={props.amount}
          currencyId={props.currencyId}
        />
        {checkoutStage()}
        <LegalSectionContainer />
      </Page>
    </div>
  );
}
