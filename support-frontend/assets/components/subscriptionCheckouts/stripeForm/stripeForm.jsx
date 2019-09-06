/* eslint-disable react/no-unused-state */
// @flow

import React, { Component, type Node } from 'react';
import { injectStripe } from 'react-stripe-elements';
import {
  CardNumber,
  CardExpiry,
  CardCvc,
} from './cardElements';
import Button from 'components/button/button';
import { ErrorSummary } from '../submitFormErrorSummary';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';

import './stripeForm.scss';

// Types

type PropTypes = {
  component: Node,
  stripe: Object,
  allErrors: FormError<FormField>[],
  setStripeToken: Function,
  submitForm: Function,
  name: string,
  validateForm: Function,
}

type StateTypes = {
  incomplete_number: string,
  incomplete_expiry: string,
  incomplete_cvc: string,
}

// Main component

class StripeForm extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      incomplete_number: '',
      incomplete_expiry: '',
      incomplete_cvc: '',
    };
  }

  handleError = (error: Object) => {
    this.setState({ [error.code]: error.message });
  }

  requestStripeToken = (event) => {
    event.preventDefault();
    this.props.validateForm();
    if (this.props.stripe && this.props.allErrors.length === 0) {
      const { stripe } = this.props;
      stripe.createToken({ type: 'card', name: this.props.name })
        .then(({ token, error }) => {
          if (error) {
            this.handleError(error);
          } else {
            this.props.setStripeToken(token.id);
          }
        })
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
            <CardNumber error={this.state.incomplete_number} />
            <CardExpiry error={this.state.incomplete_expiry} />
            <CardCvc error={this.state.incomplete_cvc} />
            <div className="component-stripe-submit-button">
              <Button onClick={event => this.requestStripeToken(event)}>
                Start your free trial now
              </Button>
            </div>
            <span>{this.props.component}</span>
            {this.props.allErrors.length > 0 && <ErrorSummary errors={this.props.allErrors} />}
          </div>
        )}
      </span>
    );
  }

}

export default injectStripe(StripeForm);
