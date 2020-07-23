// @flow

// ----- Imports ----- //

import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import * as stripeJs from "@stripe/stripe-js";

import StripeCardForm from './StripeCardForm';
import { getStripeKey, stripeAccountForContributionType } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ContributionType } from 'helpers/contributions';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
import { setupStripe } from 'helpers/stripe';
import AnimatedDots from 'components/spinners/animatedDots';
import './stripeCardForm.scss';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  country: IsoCountry,
  currency: IsoCurrency,
  isTestUser: boolean,
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  setStripeHasLoaded: () => void,
  stripeHasLoaded: boolean,
|};

const StripeCardFormContainer = (props: PropTypes) => {
  const [stripe, setStripe] = React.useState<Stripe | null>(null);

  React.useEffect(() => {
    if (!props.stripeHasLoaded) {
      setupStripe(props.setStripeHasLoaded);
    } else if (stripe === null) {

      const stripeAccount = stripeAccountForContributionType[props.contributionType];
      const stripeKey = getStripeKey(
        stripeAccount,
        props.country,
        props.isTestUser,
      );

      stripeJs.loadStripe(stripeKey).then(setStripe);
    }
  });

  if (props.paymentMethod === Stripe) {
    if (props.stripeHasLoaded && stripe) {

      const stripeAccount = stripeAccountForContributionType[props.contributionType];

      const stripeKey = getStripeKey(
        stripeAccount,
        props.country,
        props.isTestUser,
      );

      /**
       * The `key` attribute is necessary here because you cannot modify the apiKey on StripeProvider.
       * Instead, we must create separate instances for ONE_OFF and REGULAR.
       */
      return (
        <div className="stripe-card-element-container">
          <Elements stripe={stripe} key={stripeKey}>
            <StripeCardForm stripeKey={stripeKey}/>
          </Elements>
        </div>
      );
    }
    return <AnimatedDots appearance="dark" />;

  }
  return null;
};

export default StripeCardFormContainer;
