// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import Button from 'components/button/button';
import { type Option } from 'helpers/types/option';
import { type PaymentMethod } from 'helpers/paymentMethods';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';
import { ErrorSummary } from './submitFormErrorSummary';

import 'components/forms/customFields/error.scss';
import './subscriptionSubmitButton.scss';

// ----- Types ----- //

type PropTypes = {|
  paymentMethod: Option<PaymentMethod>,
  allErrors: FormError<FormField>[],
  className?: Option<string>,
  component?: Option<Node>,
  text: string,
|};

// ----- Render ----- //


function SubscriptionSubmitButton(props: PropTypes) {
  return (
    <span className={props.paymentMethod === props.className ? 'show' : 'is-hidden'}>
      <div className="component-submit-button">
        <div className={props.paymentMethod ? `component-submit-button--${props.paymentMethod}` : 'component-submit-button'}>
          <Button
            id="qa-submit-button"
            type="submit"
          >
            {props.text}
          </Button>
          <span>{props.component}</span>
        </div>
        <span>{props.allErrors.length > 0 && <ErrorSummary errors={props.allErrors} />}</span>
      </div>
    </span>
  );
}

SubscriptionSubmitButton.defaultProps = {
  className: '',
  component: null,
};

export { SubscriptionSubmitButton };
