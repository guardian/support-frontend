// @flow

// Docs: https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement

// ----- Imports ----- //

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
  getStripeKey,
  stripeAccountForContributionType,
  StripeAccount,
} from 'helpers/paymentIntegrations/stripeCheckout';
import type {
  ContributionType,
  OtherAmounts,
  SelectedAmounts,
} from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import { setupStripe } from 'helpers/stripe';
import StripePaymentRequestButton from './StripePaymentRequestButton';
import * as stripeJs from '@stripe/stripe-js';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  country: IsoCountry,
  currency: IsoCurrency,
  isTestUser: boolean,
  contributionType: ContributionType,
  setStripeHasLoaded: () => void,
  stripeHasLoaded: boolean,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
|};

// ----- Component ----- //

const StripePaymentRequestButtonContainer = (props: PropTypes) => {
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
      console.log('loading stripe', stripeAccount);

      stripeJs.loadStripe(stripeKey).then(newStripe => setStripeObjects({
        ...stripeObjects,
        [stripeAccount]: newStripe,
      }));
    }
  }, [props.stripeHasLoaded, props.contributionType]);

  const showStripePaymentRequestButton = isInStripePaymentRequestAllowedCountries(props.country);

  if (showStripePaymentRequestButton && stripeObjects[stripeAccount]) {
    const amount = getAmount(props.selectedAmounts, props.otherAmounts, props.contributionType);

    /**
     * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
     * Instead, we create separate instances for ONE_OFF and REGULAR
     */
    return (
      <div className="stripe-payment-request-button" key={stripeAccount}>
        <Elements stripe={stripeObjects[stripeAccount]}>
          <StripePaymentRequestButton
            stripeAccount={stripeAccount}
            amount={amount}
            stripeKey={stripeKey}
          />
        </Elements>
      </div>
    );
  }
  return null;
};

export default StripePaymentRequestButtonContainer;
