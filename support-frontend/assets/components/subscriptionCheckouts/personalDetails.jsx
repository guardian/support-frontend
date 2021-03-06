// @flow
import React from 'react';
import { TextInput } from '@guardian/src-text-input';
import { css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import { textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { Button, buttonReaderRevenueBrandAlt } from '@guardian/src-button';

import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';

import { type FormField } from 'helpers/subscriptionsForms/formFields';

const marginBotom = css`
  margin-bottom: ${space[6]}px;
`;

const sansText = css`
  ${textSans.medium()};
`;

const paragraphWithButton = css`
  margin-top: ${space[2]}px;
  ${textSans.medium()};
`;

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

type EmailFooterTypes = {
  handleSignOut: Function,
}

const EmailFooter = (props: EmailFooterTypes) => (
  <div css={marginBotom}>
    <CheckoutExpander copy="Want to use a different email address?">
      <p css={sansText}>You will be able to edit this in your account once you have completed this checkout.</p>
    </CheckoutExpander>
    <CheckoutExpander copy="Not you?">
      <p css={paragraphWithButton}>
        <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
          <Button
            icon={null}
            type="button"
            onClick={e => props.handleSignOut(e)}
            priority="tertiary"
            size="small"
          >
          Sign out
          </Button> and create a new account.
        </ThemeProvider>
      </p>
    </CheckoutExpander>
  </div>
);

export default function PersonalDetails(props: PropTypes) {
  const handleSignOut = (e) => {
    e.preventDefault();
    props.signOut();
  };

  return (
    <div id="qa-personal-details">
      <TextInput
        css={marginBotom}
        id="first-name"
        label="First name"
        type="text"
        value={props.firstName}
        onChange={e => props.setFirstName(e.target.value)}
        error={firstError('firstName', props.formErrors)}
      />
      <TextInput
        css={marginBotom}
        id="last-name"
        label="Last name"
        type="text"
        value={props.lastName}
        onChange={e => props.setLastName(e.target.value)}
        error={firstError('lastName', props.formErrors)}
      />
      <TextInput
        label="Email"
        type="email"
        disabled
        value={props.email}
      />
      <EmailFooter handleSignOut={handleSignOut} />
      <TextInput
        id="telephone"
        label="Telephone"
        optional
        type="tel"
        value={props.telephone}
        onChange={e => props.setTelephone(e.target.value)}
        supporting="We may use this to get in touch with you about your subscription."
        error={firstError('telephone', props.formErrors)}
      />
    </div>
  );
}
