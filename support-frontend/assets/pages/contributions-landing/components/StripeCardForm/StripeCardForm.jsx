// @flow

// ----- Imports ----- //

import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {connect} from "react-redux";
import type {State} from "assets/pages/contributions-landing/contributionsLandingReducer";
import {onThirdPartyPaymentAuthorised, paymentWaiting} from "../../contributionsLandingActions";
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import {type PaymentResult} from 'helpers/paymentIntegrations/readerRevenueApis';
import {setCreateStripePaymentMethod, setHandleStripe3DS} from 'pages/contributions-landing/contributionsLandingActions';
import {type ContributionType} from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';
import type {Action} from "../../contributionsLandingActions";

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  contributionType: ContributionType,
  setCreateStripePaymentMethod: ((email: string) => void) => Action,
  setHandleStripe3DS: ((clientSecret: string) => void) => Action,
  paymentWaiting: (isWaiting: boolean) => Action,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised:
    (paymentAuthorisation: PaymentAuthorisation) =>
      dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation)),
  setCreateStripePaymentMethod: (createStripePaymentMethod: (email: string) => void) =>
    dispatch(setCreateStripePaymentMethod(createStripePaymentMethod)),
  setHandleStripe3DS: (handleStripe3DS: (clientSecret: string) => void) =>
    dispatch(setHandleStripe3DS(handleStripe3DS)),
  paymentWaiting: (isWaiting: boolean) =>
    dispatch(paymentWaiting(isWaiting))
});

function CardForm(props: PropTypes) {

  props.setCreateStripePaymentMethod((email: string) => {
    props.paymentWaiting(true);

    props.stripe.createPaymentMethod('card', {
      billing_details: { email }
    }).then(result => {
      //TODO - error handling
      console.log("paymentMethod", result)
      props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: result.paymentMethod.id})
    });
  });

  props.setHandleStripe3DS((clientSecret: string) => {
    return props.stripe.handleCardAction(clientSecret).then(result => {
      console.log("handle3DS", result)
      return result.paymentIntent
    })
  });

  return (<CardElement hidePostalCode={true}/>)
}

// ----- Default props----- //

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
