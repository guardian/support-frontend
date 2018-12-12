// @flow

// Docs: https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement

// ----- Imports ----- //

import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getStripeKey } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import type { ApplePayTestVariant } from 'helpers/abTests/abtestDefinitions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { hiddenIf } from 'helpers/utilities';
import StripePaymentRequestButton from './StripePaymentRequestButton';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  country: IsoCountry,
  currency: IsoCurrency,
  isTestUser: boolean,
  contributionType: ContributionType,
  applePayTestVariant: ApplePayTestVariant,
  setStripeHasLoaded: () => void,
  stripeHasLoaded: boolean,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
|};


const setupStripe = (setStripeHasLoaded: () => void) => {
  const htmlElement = document.getElementById('stripe-js');
  if (htmlElement !== null) {
    htmlElement.addEventListener(
      'load',
      setStripeHasLoaded,
    );
  }
};

// ----- Component ----- //

function StripePaymentRequestButtonContainer(props: PropTypes) {

  const showStripePaymentRequestButton = isInStripePaymentRequestAllowedCountries(props.country)
    && props.currency !== 'AUD'
    && props.applePayTestVariant === 'applePay';

  if (showStripePaymentRequestButton) {

    if (props.stripeHasLoaded === false && window.Stripe === undefined) {
      setupStripe(props.setStripeHasLoaded);
      return null;
    }

    const key = getStripeKey('ONE_OFF', props.currency, props.isTestUser);
    const amount = getAmount(props.selectedAmounts, props.otherAmounts, props.contributionType);

    return (
      <div className={hiddenIf(props.contributionType !== 'ONE_OFF', 'stripe-payment-request-button')}>
        <StripeProvider apiKey={key}>
          <Elements>
            <StripePaymentRequestButton
              amount={amount}
            />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
  return null;
}

// ----- Default props----- //


export default StripePaymentRequestButtonContainer;
