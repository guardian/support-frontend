// @flow
import React from 'react';
import { TextInput } from '@guardian/src-text-input';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';

import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';

import { type FormField } from 'helpers/subscriptionsForms/formFields';

const marginBotom = css`
  margin-bottom: ${space[6]}px;
`;

export type PropTypes = {
  firstNameGiftRecipient: string,
  setFirstNameGift: Function,
  lastNameGiftRecipient: string,
  setLastNameGift: Function,
  emailGiftRecipient: string,
  setEmailGift: Function,
  formErrors: FormError<FormField>[],
}

function PersonalDetailsGift(props: PropTypes) {
  return (
    <div>
      <TextInput
        css={marginBotom}
        id="firstNameGiftRecipient"
        label="First name"
        type="text"
        value={props.firstNameGiftRecipient}
        onChange={e => props.setFirstNameGift(e.target.value)}
        error={firstError('firstNameGiftRecipient', props.formErrors)}
      />
      <TextInput
        css={marginBotom}
        id="lastNameGiftRecipient"
        label="Last name"
        type="text"
        value={props.lastNameGiftRecipient}
        onChange={e => props.setLastNameGift(e.target.value)}
        error={firstError('lastNameGiftRecipient', props.formErrors)}
      />
      <TextInput
        css={marginBotom}
        id="emailGiftRecipient"
        label="Email"
        type="email"
        optional
        onChange={e => props.setEmailGift(e.target.value)}
        value={props.emailGiftRecipient}
        error={firstError('emailGiftRecipient', props.formErrors)}
      />
    </div>
  );
}

function PersonalDetailsDigitalGift(props: PropTypes) {
  return (
    <div>
      <TextInput
        css={marginBotom}
        id="firstNameGiftRecipient"
        label="First name"
        type="text"
        value={props.firstNameGiftRecipient}
        onChange={e => props.setFirstNameGift(e.target.value)}
        error={firstError('firstNameGiftRecipient', props.formErrors)}
      />
      <TextInput
        css={marginBotom}
        id="lastNameGiftRecipient"
        label="Last name"
        type="text"
        value={props.lastNameGiftRecipient}
        onChange={e => props.setLastNameGift(e.target.value)}
        error={firstError('lastNameGiftRecipient', props.formErrors)}
      />
      <TextInput
        css={marginBotom}
        id="emailGiftRecipient"
        label="Email"
        type="email"
        onChange={e => props.setEmailGift(e.target.value)}
        value={props.emailGiftRecipient}
        error={firstError('emailGiftRecipient', props.formErrors)}
      />
    </div>
  );
}

export {
  PersonalDetailsGift,
  PersonalDetailsDigitalGift,
};
