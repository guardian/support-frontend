// @flow
import React from 'react';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { compose } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import type { FormError } from 'helpers/subscriptionsForms/validation';


export type FormField = 'firstName' | 'lastName' | 'email' | 'telephone';

export type PropTypes = {
  firstName: string,
  setFirstName: Function,
  lastName: string,
  setLastName: Function,
  email: string,
  formErrors: FormError<FormField>[],
}

const InputWithLabel = withLabel(Input);
const InputWithError = compose(asControlled, withError)(InputWithLabel);

export default function PersonalDetailsGift(props: PropTypes) {
  return (
    <div>
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
        value={props.email}
      />
    </div>
  );
}
