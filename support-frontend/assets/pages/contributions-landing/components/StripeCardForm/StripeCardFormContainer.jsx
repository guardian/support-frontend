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

// Unfortunately the only way to currently use custom fonts with Stripe Elements
// is to pass the font itself along with the styles referencing it
const customFonts = [{
  src: `local('Guardian Text Sans Web'), 
    local('GuardianTextSansWeb'),
    url(https://pasteup.guim.co.uk/fonts/1.0.0/hinting-off/kerning-on/original/GuardianTextSansWeb/GuardianTextSansWeb-Regular.woff)`,
  family: 'Guardian Text Sans Web',
  style: 'normal',
}];

class StripeCardFormContainer extends React.Component<PropTypes, void> {
  componentDidMount(): void {
    if (!this.props.stripeHasLoaded) { setupStripe(this.props.setStripeHasLoaded); }
  }

  render() {
    if (this.props.contributionType === 'ONE_OFF' &&
      this.props.paymentMethod === Stripe &&
      this.props.stripeElementsTestVariant === 'stripeCardElement') {

      if (this.props.stripeHasLoaded) {

        const key = getStripeKey('ONE_OFF', this.props.country, this.props.isTestUser);

        return (
          <div className="stripe-card-element-container">
            <StripeProvider apiKey={key}>
              <Elements fonts={customFonts}>
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
