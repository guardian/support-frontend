// @flow

// ----- Imports ----- //

import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {connect} from "react-redux";
import type {State} from "assets/pages/contributions-landing/contributionsLandingReducer";
import {onThirdPartyPaymentAuthorised} from "../../contributionsLandingActions";
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import {type PaymentResult} from 'helpers/paymentIntegrations/readerRevenueApis';
import {setCreateStripePaymentMethod} from 'pages/contributions-landing/contributionsLandingActions';
import {type ContributionType} from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  contributionType: ContributionType,
  setCreateStripePaymentMethod: (() => void) => Action,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised:
    (paymentAuthorisation: PaymentAuthorisation) =>
      dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation)),
  setCreateStripePaymentMethod: (createStripePaymentMethod: () => void) =>
    dispatch(setCreateStripePaymentMethod(createStripePaymentMethod))
});

function CardForm(props: PropTypes) {

  const onSubmit = (event) => {
    event.preventDefault();
    createPaymentMethod();
  };

  const createPaymentMethod = () => {
    props.stripe.createPaymentMethod('card', {
      billing_details: { email: 'tom.forbes@theguardian.com' }
    }).then(result => {
      //TODO - error handling
      console.log("paymentMethod", result)
      props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: result.paymentMethod.id})
    });
  };

  const handle3DS = (clientSecret: string) => {
    props.stripe.handleCardAction(clientSecret).then(result => {
      console.log("handle3DS", result)
      return result.paymentIntent
    })
  };

  props.setCreateStripePaymentMethod(createPaymentMethod);

  //TODO - get rid of form
  return (
    <form className='stripe-card-element' onSubmit={onSubmit}>
      <CardElement hidePostalCode={true}/>
    </form>
  )
}

// ----- Default props----- //

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
