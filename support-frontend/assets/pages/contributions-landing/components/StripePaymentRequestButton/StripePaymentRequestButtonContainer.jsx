// @flow

// Docs: https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement

// ----- Imports ----- //

import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getStripeKey, stripeAccountForContributionType } from 'helpers/paymentIntegrations/stripeCheckout';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { setupStripe } from 'helpers/stripe';
import StripePaymentRequestButton from './StripePaymentRequestButton';


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
  transactionFeeConsent: boolean,
|};

const enabledForRecurring = (): boolean => !!window.guardian.recurringStripePaymentRequestButton;

// ----- Component ----- //

class StripePaymentRequestButtonContainer extends React.Component<PropTypes, void> {

  componentDidMount(): void {
    if (!this.props.stripeHasLoaded) { setupStripe(this.props.setStripeHasLoaded); }
  }

  render() {
    const showStripePaymentRequestButton =
      isInStripePaymentRequestAllowedCountries(this.props.country) &&
      (this.props.contributionType === 'ONE_OFF' || enabledForRecurring());

    if (showStripePaymentRequestButton && this.props.stripeHasLoaded) {
      const stripeAccount = stripeAccountForContributionType[this.props.contributionType];
      const apiKey = getStripeKey(stripeAccount, this.props.country, this.props.isTestUser);
      const amount = getAmount(
        this.props.selectedAmounts,
        this.props.otherAmounts,
        this.props.contributionType,
        this.props.transactionFeeConsent,
      );

      /**
       * The `key` attribute is necessary here because you cannot modify the apiKey on StripeProvider.
       * Instead, we must create separate instances for ONE_OFF and REGULAR.
       *
       * This means that e.g. switching from monthly to one-off would cause it to create a new ONE_OFF StripeProvider
       * with new children. However, switching back to monthly/annual would not then re-create the REGULAR instance.
       */
      return (
        <div className="stripe-payment-request-button">
          <StripeProvider apiKey={apiKey} key={stripeAccount}>
            <Elements>
              <StripePaymentRequestButton
                stripeAccount={stripeAccount}
                amount={amount}
              />
            </Elements>
          </StripeProvider>
        </div>
      );
    }
    return null;
  }
}

export default StripePaymentRequestButtonContainer;
