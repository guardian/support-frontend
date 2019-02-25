// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProgressMessage from 'components/progressMessage/progressMessage';
import Content, { Divider } from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';

import { type Stage, type State } from '../paperSubscriptionCheckoutReducer';

import CheckoutForm from './checkoutForm';
import ReturnSection from './returnSection';

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
          <HeroWrapper>
            <HeadingBlock>Your Paper subscription is now live</HeadingBlock>
          </HeroWrapper>
          ty page
          <ReturnSection />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div className="thank-you-stage">
          <HeroWrapper>
            <HeadingBlock>Your Paper subscription is being processed</HeadingBlock>
          </HeroWrapper>
          ty page but its pending sadface
          <ReturnSection />
        </div>
      );

    case 'checkout':
    default:
      return (
        <div className="checkout-content">
          <HeroWrapper appearance="custom">
            <HeadingBlock>Paper</HeadingBlock>
          </HeroWrapper>
          <Content>
            <Text>
              <LargeParagraph>Please enter your details below to complete your Paper subscription.</LargeParagraph>
            </Text>
            <Divider />
          </Content>
          <CheckoutForm />
          {props.formSubmitted ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </div>
      );
  }
}

// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
