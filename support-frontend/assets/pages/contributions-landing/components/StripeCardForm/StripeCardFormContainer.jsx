// @flow

// ----- Imports ----- //

import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import StripeCardForm from "./StripeCardForm";
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
// import { setupStripe } from 'helpers/stripe';
import type {StripeElementsTestVariants} from "assets/helpers/abTests/abtestDefinitions";
import AnimatedDots from 'components/spinners/animatedDots';
import './stripeCardForm.scss'

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  country: IsoCountry,
  currency: IsoCurrency,
  isTestUser: boolean,
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  stripeElementsTestVariant: StripeElementsTestVariants,
  setStripeHasLoaded: () => void,
  stripeHasLoaded: boolean,
|};

function StripeCardFormContainer(props: PropTypes) {
  if (props.contributionType === 'ONE_OFF' &&
    props.paymentMethod === Stripe &&
    props.stripeElementsTestVariant === 'stripeCardElement') {

    // console.log("props.stripeHasLoaded", props.stripeHasLoaded, window.Stripe === undefined)

    if (props.stripeHasLoaded === false && window.Stripe === undefined) {
      // debugger
      // setupStripe(props.setStripeHasLoaded);

      return <AnimatedDots appearance='dark'/>
    }
    // debugger

    const key = getStripeKey('ONE_OFF', props.currency, props.isTestUser);

    return (
      <div className='stripe-card-element-container'>
        <StripeProvider apiKey={key}>
          <Elements onChange={(ev) => console.log("ELEMENTS CHANGE:", ev)}>
            <StripeCardForm/>
          </Elements>
        </StripeProvider>
      </div>
    )
  }
  return null
}

// ----- Default props----- //


export default StripeCardFormContainer;
