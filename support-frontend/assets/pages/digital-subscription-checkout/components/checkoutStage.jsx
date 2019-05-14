// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProgressMessage from 'components/progressMessage/progressMessage';
import type { Stage, State } from 'helpers/subscriptionsForms/formFields';

import ThankYouContent from './thankYouContent';
import ThankYouPendingContent from './thankYouPendingContent';
import CheckoutForm from './checkoutForm';
import ReturnSection from './returnSection';
import ThankYouHero from './thankYou/hero';


// ----- Types ----- //

type PropTypes = {|
  stage: Stage,
  formSubmitted: boolean,
  countryGroupId: CountryGroupId,
|};


// ----- State/Props Maps ----- //

function mapStateToProps(state: State): PropTypes {

  return {
    stage: state.page.checkout.stage,
    formSubmitted: state.page.checkout.formSubmitted,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Component ----- //

function CheckoutStage(props: PropTypes) {

  switch (props.stage) {

    case 'thankyou':
      return (
        <div className="thank-you-stage">
          <ThankYouHero
            countryGroupId={props.countryGroupId}
          />
          <HeroWrapper appearance="custom">
            <HeadingBlock>
              Your Digital Pack subscription is now live
            </HeadingBlock>
          </HeroWrapper>
          <ThankYouContent countryGroupId={props.countryGroupId} />
          <ReturnSection />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div className="thank-you-stage">
          <ThankYouHero
            countryGroupId={props.countryGroupId}
          />
          <HeroWrapper appearance="custom">
            <HeadingBlock>
              Your Digital Pack subscription is being processed
            </HeadingBlock>
          </HeroWrapper>
          <ThankYouPendingContent />
          <ReturnSection />
        </div>
      );

    case 'checkout':
    default:
      return (
        <div className="checkout-content">
          <CheckoutForm />
          {props.formSubmitted ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </div>
      );

  }

}


// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
