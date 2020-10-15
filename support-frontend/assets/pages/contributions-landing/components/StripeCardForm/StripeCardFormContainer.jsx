// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';

import StripeCardForm from './StripeCardForm';
import { getStripeKey, stripeAccountForContributionType, type StripeAccount } from 'helpers/stripe';
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
  // Create separate Stripe objects for REGULAR and ONE_OFF
  const [stripeObjects, setStripeObjects] = React.useState<{[StripeAccount]: stripeJs.Stripe | null}>({
    REGULAR: null,
    ONE_OFF: null,
  });

  const stripeAccount = stripeAccountForContributionType[props.contributionType];
  const stripeKey = getStripeKey(
    stripeAccount,
    props.country,
    props.isTestUser,
  );

  React.useEffect(() => {
    if (!props.stripeHasLoaded) {
      setupStripe(props.setStripeHasLoaded);
    } else if (stripeObjects[stripeAccount] === null) {

      stripeJs.loadStripe(stripeKey).then(newStripe =>
        setStripeObjects(prevData => ({
          ...prevData,
          [stripeAccount]: newStripe,
        })));
    }
  }, [props.stripeHasLoaded, props.contributionType]);

  if (props.paymentMethod === Stripe) {
    if (stripeObjects[stripeAccount]) {

      // `options` must be set even if it's empty, otherwise we get 'Unsupported prop change on Elements' warnings
      // in the console
      const elementsOptions = {};

      /**
       * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
       * Instead, we create separate instances for ONE_OFF and REGULAR
       */
      return (
        <div className="stripe-card-element-container" key={stripeAccount}>
          <Elements stripe={stripeObjects[stripeAccount]} options={elementsOptions}>
            <StripeCardForm
              stripeKey={stripeKey}
              isTestUser={props.isTestUser}
            />
          </Elements>
        </div>
      );
    }
    return <AnimatedDots appearance="dark" />;

  }
  return null;
};

export default StripeCardFormContainer;
