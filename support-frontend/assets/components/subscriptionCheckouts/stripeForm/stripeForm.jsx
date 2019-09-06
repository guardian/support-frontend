// @flow

import React, { Component, type Node } from 'react';
import { injectStripe } from 'react-stripe-elements';
import {
  CardNumber,
  CardExpiry,
  CardCvc,
} from './cardElements';
import Button from 'components/button/button';

import './stripeForm.scss';
import { ErrorSummary } from '../submitFormErrorSummary';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';

// Types

type PropTypes = {
  component: Node,
  stripe: Object,
  allErrors: FormError<FormField>[],
  setStripeToken: Function,
  submitForm: Function,
  name: string,
}

// Main component

class StripeForm extends Component<PropTypes> {
  // This bit is still a stand in for the real code, which needs to be dynamic

  requestStripeToken = (event) => {
    event.preventDefault();
    if (this.props.stripe) {
      const { stripe } = this.props;
      stripe.createToken({ type: 'card', name: this.props.name })
        .then(tokenObject => this.props.setStripeToken(tokenObject.token.id))
        .then(() => this.props.submitForm());
    }
  }

  render() {
    const { stripe } = this.props;
    if (stripe) {
      stripe.elements();
    }
    return (
      <span>
        {stripe && (
          <div>
            <CardNumber />
            <CardExpiry />
            <CardCvc />
            <Button onClick={event => this.requestStripeToken(event)}>
              Start your free trial now
            </Button>
            <span>{this.props.component}</span>
            {this.props.allErrors.length > 0 && <ErrorSummary errors={this.props.allErrors} />}
          </div>
        )}
      </span>
    );
  }

}

export default injectStripe(StripeForm);
