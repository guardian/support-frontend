// @flow

// ----- Imports ----- //

import React from 'react';

import Button from 'components/button/button';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { PayPal } from 'helpers/paymentMethods';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';
import { ErrorSummary } from './submitFormErrorSummary';

import 'components/forms/customFields/error.scss';
import './subscriptionSubmitButton.scss';

// ----- Types ----- //

type PropTypes = {|
  paymentMethod: Option<PaymentMethod>,
  allErrors: FormError<FormField>[],
|};

// ----- Render ----- //


function SubscriptionSubmitButton(props: PropTypes) {
  return (
    <span>
      {props.paymentMethod !== PayPal && (
      <div className="component-submit-button">
        <div className="component-submit-button--margin">
          <Button
            id="qa-submit-button"
            type="submit"
          >
            Continue to payment
          </Button>
        </div>
        <span>{props.allErrors.length > 0 && <ErrorSummary errors={props.allErrors} />}</span>
      </div>)}
    </span>
  );
}

export { SubscriptionSubmitButton };
