// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProgressMessage from 'components/progressMessage/progressMessage';
import Content, { Divider } from 'components/content/content';

import { type Stage, type State } from './paperSubscriptionCheckoutReducer';

import CheckoutForm from './components-checkout/checkoutForm';
import ReturnSection from './components-ty/returnSection';
import ThankYouContent from './components-ty/thankYou';

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
        <div>
          <ThankYouContent isPending={false} />
          <ReturnSection />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div>
          <ThankYouContent isPending />
          <ReturnSection />
        </div>
      );

    case 'checkout':
    default:
      return (
        <div className="checkout-content">
          <HeroWrapper appearance="custom">
            <HeadingBlock>Checkout</HeadingBlock>
          </HeroWrapper>
          <Content>
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
