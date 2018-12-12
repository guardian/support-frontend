// @flow

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
  stripeCheckoutLibrary: Object | null,
  contributionType: ContributionType,
  applePayTestVariant: ApplePayTestVariant,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
|};

// ----- Component ----- //

function StripePaymentRequestButtonContainer(props: PropTypes) {

  const showApplePay = isInStripePaymentRequestAllowedCountries(props.country)
    && props.currency !== 'AUD'
    && props.applePayTestVariant === 'applePay'
    && props.stripeCheckoutLibrary;

  // TODO: set up for AU
  if (showApplePay) {
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
