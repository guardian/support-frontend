// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProgressMessage from 'components/progressMessage/progressMessage';

import { type Stage } from 'helpers/subscriptionsForms/formFields';
import ThankYouContent from './components/thankYou';
import CheckoutForm from './components/checkoutForm';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {|
  stage: Stage,
  formSubmitted: boolean,
  countryGroupId: CountryGroupId,
|};

// ----- State/Props Maps ----- //

function mapStateToProps(state: WithDeliveryCheckoutState): PropTypes {
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
          <ReturnSection subscriptionProduct="Paper" />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div>
          <ThankYouContent isPending />
          <ReturnSection subscriptionProduct="Paper" />
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
