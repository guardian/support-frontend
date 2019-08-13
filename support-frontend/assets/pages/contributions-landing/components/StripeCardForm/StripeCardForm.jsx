// @flow

// ----- Imports ----- //

import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {connect} from "react-redux";
import type {State} from "assets/pages/contributions-landing/contributionsLandingReducer";
import {onStripePaymentIntentApiPaymentAuthorised} from "../../contributionsLandingActions";
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import {type PaymentResult} from 'helpers/paymentIntegrations/readerRevenueApis';
import {setThirdPartyPaymentLibrary} from 'pages/contributions-landing/contributionsLandingActions';
import {type ContributionType} from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  contributionType: ContributionType,
  setThirdPartyPaymentLibrary: (?{ [ContributionType]: { [PaymentMethod]: ThirdPartyPaymentLibrary }}) => Action,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised:
    (paymentAuthorisation: PaymentAuthorisation) =>
      dispatch(onStripePaymentIntentApiPaymentAuthorised(paymentAuthorisation)),
  setThirdPartyPaymentLibrary:
    (thirdPartyPaymentLibraryByContrib: {
      [ContributionType]: {
        [PaymentMethod]: ThirdPartyPaymentLibrary
      }
    }) => dispatch(setThirdPartyPaymentLibrary(thirdPartyPaymentLibraryByContrib)),
});

function CardForm(props: PropTypes) {

  const onSubmit = (event) => {
    event.preventDefault();
    createPaymentMethod();
  };


  //TODO - this needs to be called when the contribute button is clicked
  //as this component is created, add this function to redux store as
  const createPaymentMethod = () => {
    debugger
    props.stripe.createPaymentMethod('card', {
      billing_details: { email: 'tom.forbes@theguardian.com' }
    }).then(result => {
      //TODO - error handling
      console.log("paymentMethod", result)
      props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: result.paymentMethod.id})
    });
  };

  props.setThirdPartyPaymentLibrary({ [props.contributionType]: { Stripe: createPaymentMethod } });

  return (
    <form className='stripe-card-element' onSubmit={onSubmit}>
      <CardElement
      />
      <button type='submit'>Submit</button>
    </form>
  )
}

// ----- Default props----- //

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
