// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import { connect } from "react-redux";
import ProgressMessage from "components/progressMessage/progressMessage";
import type { Stage } from "helpers/subscriptionsForms/formFields";
import "helpers/subscriptionsForms/formFields";
import type { SubscriptionProduct } from "helpers/productPrice/subscriptions";
import "helpers/productPrice/subscriptions";
import ReturnSection from "components/subscriptionCheckouts/thankYou/returnSection";
import type { WithDeliveryCheckoutState } from "helpers/subscriptionsForms/subscriptionCheckoutReducer";
// ----- Types ----- //
type PropTypes = {
  stage: Stage;
  formSubmitted: boolean;
};
type StagePropTypes = {
  stage: Stage;
  formSubmitted: boolean;
  checkoutForm: Node;
  thankYouContentPending: Node;
  thankYouContent: Node;
  subscriptionProduct: SubscriptionProduct;
};

// ----- State/Props Maps ----- //
function mapStateToProps(state: WithDeliveryCheckoutState): PropTypes {
  return {
    stage: state.page.checkout.stage,
    formSubmitted: state.page.checkout.formSubmitted
  };
}

// ----- Component ----- //
function CheckoutStage(props: StagePropTypes) {
  switch (props.stage) {
    case 'thankyou':
      return <div>
          {props.thankYouContent}
          <ReturnSection subscriptionProduct={props.subscriptionProduct} />
        </div>;

    case 'thankyou-pending':
      return <div>
          {props.thankYouContentPending}
          <ReturnSection subscriptionProduct={props.subscriptionProduct} />
        </div>;

    case 'checkout':
    default:
      return <div className="checkout-content">
          {props.checkoutForm}
          {props.formSubmitted ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </div>;
  }
} // ----- Export ----- //


export default connect(mapStateToProps)(CheckoutStage);