// @flow

import * as React from 'react';
import { type StripeFormPropTypes } from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCountry } from 'helpers/internationalisation/country';
import StripeProviderWrapper
  from 'components/subscriptionCheckouts/stripeForm/stripeProviderWrapper';

// Types

type PropTypes = {
  ...StripeFormPropTypes,
  country: IsoCountry,
  isTestUser: boolean,
};

type StateType = {
  stripeKey: string,
  [string]: React.Node,
}

class StripeProviderForCountry extends React.Component<PropTypes, StateType> {

  componentDidMount() {
    const props = this.props;
    const stripeKey = getStripeKey('REGULAR', props.country, props.isTestUser);
    this.state = {
      stripeKey: stripeKey,
      [stripeKey]: (<StripeProviderWrapper {...props} stripeKey={stripeKey} key={stripeKey} />),
    };
  }

  render() {
    const props = this.props;
    const stripeKey = getStripeKey('REGULAR', props.country, props.isTestUser);
    if(!this.state[stripeKey]){
      console.log(`stripe provider not found for ${stripeKey} creating it now`);
      this.setState({
        stripeKey: stripeKey,
        [stripeKey]: (<StripeProviderWrapper {...props} stripeKey={stripeKey} key={stripeKey} />),
      });
    }

    console.log(`rendering with stripeKey ${stripeKey}`);
    return this.state[stripeKey];
  }
}

export { StripeProviderForCountry };
