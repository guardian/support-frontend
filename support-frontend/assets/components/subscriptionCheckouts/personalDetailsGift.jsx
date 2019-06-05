// @flow
import React from 'react';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { compose } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';


export type PropTypes = {
  firstNameGiftRecipient: string,
  setFirstNameGift: Function,
  lastNameGiftRecipient: string,
  setLastNameGift: Function,
  emailGiftRecipient: string,
  setEmailGift: Function,
  formErrors: FormError<FormField>[],
}

const InputWithLabel = withLabel(Input);
const InputWithError = compose(asControlled, withError)(InputWithLabel);

export default function PersonalDetailsGift(props: PropTypes) {
  return (
    <div>
      <InputWithError
        id="firstNameGiftRecipient"
        label="First name"
        type="text"
        value={props.firstNameGiftRecipient}
        setValue={props.setFirstNameGift}
        error={firstError('firstNameGiftRecipient', props.formErrors)}
      />
      <InputWithError
        id="lastNameGiftRecipient"
        label="Last name"
        type="text"
        value={props.lastNameGiftRecipient}
        setValue={props.setLastNameGift}
        error={firstError('lastNameGiftRecipient', props.formErrors)}
      />
      <InputWithError
        id="emailGiftRecipient"
        label="Email"
        type="emailGiftRecipient"
        value={props.emailGiftRecipient}
        setValue={props.setEmailGift}
        optional
        error={firstError('emailGiftRecipient', props.formErrors)}
      />
    </div>
  );
}
