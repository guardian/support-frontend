// @flow
import React from 'react';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { compose } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import Button from 'components/button/button';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import { type FormField } from 'helpers/subscriptionsForms/formFields';

export type PropTypes = {
  firstName: string,
  setFirstName: Function,
  lastName: string,
  setLastName: Function,
  email: string,
  telephone: Option<string>,
  setTelephone: Function,
  formErrors: FormError<FormField>[],
  signOut: Function,
}

const InputWithLabel = withLabel(Input);
const InputWithError = compose(asControlled, withError)(InputWithLabel);

export default function PersonalDetails(props: PropTypes) {
  const emailFooter = (
    <span>
      <CheckoutExpander copy="Want to use a different email address?">
        <p>You will be able to edit this in your account once you have completed this checkout.</p>
      </CheckoutExpander>
      <CheckoutExpander copy="Not you?">
        <p>
          <Button
            appearance="greyHollow"
            icon={null}
            type="button"
            onClick={() => props.signOut()}
          >
            Sign out
          </Button> and create a new account.
        </p>
      </CheckoutExpander>
    </span>
  );

  return (
    <div id="qa-personal-details">
      <InputWithError
        id="first-name"
        label="First name"
        type="text"
        value={props.firstName}
        setValue={props.setFirstName}
        error={firstError('firstName', props.formErrors)}
      />
      <InputWithError
        id="last-name"
        label="Last name"
        type="text"
        value={props.lastName}
        setValue={props.setLastName}
        error={firstError('lastName', props.formErrors)}
      />
      <InputWithLabel
        id="email"
        label="Email"
        type="email"
        disabled
        value={props.email}
        footer={emailFooter}
      />
      <InputWithError
        id="telephone"
        label="Telephone"
        optional
        type="tel"
        value={props.telephone}
        setValue={props.setTelephone}
        footer="We may use this to get in touch with you about your subscription."
        error={firstError('telephone', props.formErrors)}
      />
    </div>
  );
}
