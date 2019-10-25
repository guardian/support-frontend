// @flow

// ----- Imports ----- //

import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import StripeCardForm from './StripeCardForm';
import { getStripeKey, stripeAccountForContributionType } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ContributionType } from 'helpers/contributions';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
import { setupStripe } from 'helpers/stripe';
import AnimatedDots from 'components/spinners/animatedDots';
import './stripeCardForm.scss';
import type { LandingPageStripeElementsRecurringTestVariants } from 'helpers/abTests/abtestDefinitions';

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
  stripeElementsRecurringTestVariant: LandingPageStripeElementsRecurringTestVariants,
  showSecureBackground: boolean,
|};

class StripeCardFormContainer extends React.Component<PropTypes, void> {

  componentDidMount(): void {
    if (!this.props.stripeHasLoaded) { setupStripe(this.props.setStripeHasLoaded); }
  }

  render() {
    if (this.props.paymentMethod === Stripe &&
      (this.props.contributionType === 'ONE_OFF' || this.props.stripeElementsRecurringTestVariant === 'stripeElements')
    ) {
      if (this.props.stripeHasLoaded) {

        const stripeAccount = stripeAccountForContributionType[this.props.contributionType];

        const stripeKey = getStripeKey(
          stripeAccount,
          this.props.country,
          this.props.isTestUser,
        );

        const classNames = this.props.showSecureBackground ? 'stripe-card-element-container stripe-card-element-container-secure' : 'stripe-card-element-container';

        /**
         * The `key` attribute is necessary here because you cannot modify the apiKey on StripeProvider.
         * Instead, we must create separate instances for ONE_OFF and REGULAR.
         */
        return (
          <div className={classNames}>
            <StripeProvider apiKey={stripeKey} key={stripeAccount}>
              <Elements>
                <StripeCardForm stripeKey={stripeKey} />
              </Elements>
            </StripeProvider>
          </div>
        );
      }
      return <AnimatedDots appearance="dark" />;

    }
    return null;

  }
}

export default StripeCardFormContainer;
