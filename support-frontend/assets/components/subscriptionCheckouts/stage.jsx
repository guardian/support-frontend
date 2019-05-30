// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProgressMessage from 'components/progressMessage/progressMessage';

import { type Stage } from 'helpers/subscriptionsForms/formFields';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {|
  stage: Stage,
  formSubmitted: boolean,
  countryGroupId: CountryGroupId,
|};

type StagePropTypes = {
  stage: Stage,
  formSubmitted: boolean,
  countryGroupId: CountryGroupId,
  checkoutForm: Node,
  thankYouContentPending: Node,
  thankYouContentNotPending: Node,
  subscriptionProduct: SubscriptionProduct,
}

// ----- State/Props Maps ----- //

function mapStateToProps(state: WithDeliveryCheckoutState): PropTypes {
  return {
    stage: state.page.checkout.stage,
    formSubmitted: state.page.checkout.formSubmitted,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };
}

// ----- Component ----- //

function CheckoutStage(props: StagePropTypes) {
  switch (props.stage) {
    case 'thankyou':
      return (
        <div>
          {props.thankYouContentNotPending}
          <ReturnSection subscriptionProduct={props.subscriptionProduct} />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div>
          {props.thankYouContentPending}
          <ReturnSection subscriptionProduct={props.subscriptionProduct} />
        </div>
      );

    case 'checkout':
    default:
      return (
        <div className="checkout-content">
          {props.checkoutForm}
          {props.formSubmitted ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </div>
      );
  }
}

// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
