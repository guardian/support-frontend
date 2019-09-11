/* eslint-disable react/no-unused-state */
// @flow

import React, { Component, type Node } from 'react';
import { compose } from 'redux';
import { injectStripe } from 'react-stripe-elements';
import Button from 'components/button/button';
import { ErrorSummary } from '../submitFormErrorSummary';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from 'react-stripe-elements';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';

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
  cardNumber: Object,
  cardExpiry: Object,
  cardCvc: Object,
  cardErrors: Array<Object>,
}

// Styles for stripe elements

const baseStyles = {
  fontSize: '16px',
  color: '#000',
  '::placeholder': {
    color: 'white',
  },
};

const invalidStyles = {
  color: '#c70000',
};

// Main component

const CardNumberWithError = compose(withError, withLabel)(CardNumberElement);
const CardExpiryWithError = compose(withError, withLabel)(CardExpiryElement);
const CardCvcWithError = compose(withError, withLabel)(CardCvcElement);

class StripeForm extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: {
        complete: false,
        empty: true,
        error: '',
        errorEmpty: 'Please enter a card number',
        errorIncomplete: 'Please enter a valid card number',
      },
      cardExpiry: {
        complete: false,
        empty: true,
        error: '',
        errorEmpty: 'Please enter an expiry date',
        errorIncomplete: 'Please enter a valid expiry date',
      },
      cardCvc: {
        complete: false,
        empty: true,
        error: '',
        errorEmpty: 'Please enter a CVC number',
        errorIncomplete: 'Please enter a valid CVC number',
      },
      cardErrors: [],
    };
  }

  getAllCardErrors = () => ['cardNumber', 'cardExpiry', 'cardCvc'].reduce((cardErrors, field) => {
    if (this.state[field].error.length > 0) {
      cardErrors.push({ field: [field], message: this.state[field].error });
    }
    return cardErrors;
  }, [])

  handleCardErrors = () => {
    // eslint-disable-next-line array-callback-return
    ['cardNumber', 'cardExpiry', 'cardCvc'].map((field) => {
      if (this.state[field].empty === true) {
        this.setState({
          [field]: {
            ...this.state[field],
            error: this.state[field].errorEmpty,
          },
        });
      } else if (!this.state[field].complete) {
        this.setState({
          [field]: {
            ...this.state[field],
            error: this.state[field].errorIncomplete,
          },
        });
      }
      this.setState({ cardErrors: this.getAllCardErrors() });
    });
  }

  handleChange = (event) => {
    if (this.state[event.elementType].error) {
      this.setState({
        [event.elementType]: {
          ...this.state[event.elementType],
          error: '',
        },
      });
    } else {
      this.setState({
        [event.elementType]: {
          ...this.state[event.elementType],
          complete: event.complete,
          empty: event.empty,
        },
      });
    }
  }

  requestStripeToken = (event) => {
    event.preventDefault();
    this.props.validateForm();
    this.handleCardErrors();
    if (this.props.stripe && this.props.allErrors.length === 0 && this.state.cardErrors.length === 0) {
      const { stripe } = this.props;
      stripe.createToken({ type: 'card', name: this.props.name })
        .then(({ token, error }) => {
          if (error) {
            console.log(error);
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
          <fieldset>
            <CardNumberWithError
              id="card-number"
              error={this.state.cardNumber.error}
              label="Card number"
              style={{ base: { ...baseStyles }, invalid: { ...invalidStyles } }}
              onChange={e => this.handleChange(e)}
            />
            <CardExpiryWithError
              id="card-expiry"
              error={this.state.cardExpiry.error}
              label="Expiry date"
              style={{ base: { ...baseStyles }, invalid: { ...invalidStyles } }}
              onChange={e => this.handleChange(e)}
            />
            <CardCvcWithError
              id="cvc"
              error={this.state.cardCvc.error}
              label="CVC"
              style={{ base: { ...baseStyles }, invalid: { ...invalidStyles } }}
              onChange={e => this.handleChange(e)}
            />
            <div className="component-stripe-submit-button">
              <Button onClick={event => this.requestStripeToken(event)}>
                Start your free trial now
              </Button>
            </div>
            <span>{this.props.component}</span>
            {(this.state.cardErrors.length > 0 || this.props.allErrors.length > 0)
              && <ErrorSummary errors={[...this.props.allErrors, ...this.state.cardErrors]} />}
          </fieldset>
        )}
      </span>
    );
  }

}

export default injectStripe(StripeForm);
