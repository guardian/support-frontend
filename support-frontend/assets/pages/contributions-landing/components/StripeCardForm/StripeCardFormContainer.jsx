// @flow

// ----- Imports ----- //

import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import StripeCardForm from './StripeCardForm';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ContributionType } from 'helpers/contributions';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
import { setupStripe } from 'helpers/stripe';
import type { StripeElementsTestVariants } from 'helpers/abTests/abtestDefinitions';
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
  stripeElementsTestVariant: StripeElementsTestVariants,
  setStripeHasLoaded: () => void,
  stripeHasLoaded: boolean,
|};

class StripeCardFormContainer extends React.Component<PropTypes, void> {

  componentDidMount(): void {
    if (!this.props.stripeHasLoaded) { setupStripe(this.props.setStripeHasLoaded); }
  }

  render() {
    if (this.props.contributionType === 'ONE_OFF' &&
      this.props.paymentMethod === Stripe &&
      this.props.stripeElementsTestVariant === 'stripeCardElement') {

      if (this.props.stripeHasLoaded) {

        const key = getStripeKey('ONE_OFF', this.props.currency, this.props.isTestUser);

        return (
          <div className="stripe-card-element-container">
            <StripeProvider apiKey={key}>
              <Elements>
                <StripeCardForm />
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
