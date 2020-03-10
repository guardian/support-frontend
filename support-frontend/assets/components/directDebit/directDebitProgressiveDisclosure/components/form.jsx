// @flow

// ----- Imports ----- //

// eslint-disable-next-line no-unused-vars
import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';

import { ThemeProvider } from 'emotion-theming';
import { Button, buttonReaderRevenue } from '@guardian/src-button';
import { TextInput } from '@guardian/src-text-input';
import { Checkbox } from '@guardian/src-checkbox';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { type ErrorReason } from 'helpers/errorReasons';
import { type Option } from 'helpers/types/option';

import { space } from '@guardian/src-foundations';

import '../directDebitForm.scss';

const spaceAfterInput = css`
  margin-bottom: ${space[6]}px;
`;

const directDebitForm = css`
  clear: left;
  margin-top: ${space[6]}px;
  margin-left: 0;
  margin-bottom: ${space[12]}px;
`;

type EventHandler = (e: SyntheticInputEvent<HTMLInputElement>) => void;

type PropTypes = {
  accountHolderName: string,
  sortCodeString: string,
  accountNumber: string,
  accountHolderConfirmation: boolean,
  accountHolderNameError: string,
  sortCodeError: string,
  accountNumberError: string,
  accountHolderConfirmationError: string,
  showGeneralError: boolean,
  accountErrorsLength: number,
  accountErrors: Array<Object>,
  submissionError: ErrorReason | null,
  submissionErrorHeading: string,
  formError: Option<string>,
  updateAccountHolderName: EventHandler,
  updateSortCodeString: EventHandler,
  updateAccountNumber: EventHandler,
  updateAccountHolderConfirmation: EventHandler,
  onChange: (field: string, dispatchUpdate: Function, event: SyntheticInputEvent<HTMLInputElement>) => void,
  onSubmit: EventHandler,
}

function Form(props: PropTypes) {
  return (
    <div css={directDebitForm}>
      <div css={spaceAfterInput}>
        <TextInput
          id="account-holder-name-input"
          value={props.accountHolderName}
          autoComplete="off"
          onChange={e => props.onChange('accountHolderName', props.updateAccountHolderName, e)}
          maxLength="40"
          className="component-direct-debit-form__text-field focus-target"
          label="Bank account holder name"
          error={props.accountHolderNameError}
        />
      </div>

      <div css={spaceAfterInput}>
        <TextInput
          id="sort-code-input"
          label="Sort code"
          autoComplete="off"
          width={10}
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          value={props.sortCodeString}
          onChange={e => props.onChange('sortCodeString', props.updateSortCodeString, e)}
          error={props.sortCodeError}
          minLength={6}
          maxLength={6}
          className="component-direct-debit-form__sort-code-field focus-target component-direct-debit-form__text-field"
        />
      </div>

      <div css={spaceAfterInput}>
        <TextInput
          id="account-number-input"
          value={props.accountNumber}
          autoComplete="off"
          onChange={e => props.onChange('accountNumber', props.updateAccountNumber, e)}
          minLength={6}
          maxLength={8}
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          className="component-direct-debit-form__text-field focus-target"
          label="Account number"
          error={props.accountNumberError}
        />
      </div>

      <div css={spaceAfterInput}>
        <Checkbox
          id="account-holder-confirmation"
          onChange={e => props.onChange('accountHolderConfirmation', props.updateAccountHolderConfirmation, e)}
          checked={props.accountHolderConfirmation}
          label="Confirmation"
          supporting="I confirm that I am the account holder and I am solely able to authorise debit from
          the account"
          error={props.accountHolderConfirmationError}
        />
      </div>
      <ThemeProvider theme={buttonReaderRevenue}>
        <Button
          id="qa-direct-debit-submit"
          onClick={e => props.onSubmit(e)}
        >
          Confirm
        </Button>
      </ThemeProvider>

      {props.accountErrorsLength > 0 && (
        <ErrorSummary errors={[...props.accountErrors]} />
      )}
      {props.showGeneralError && (
        <GeneralErrorMessage
          errorReason={props.submissionError || props.formError}
          errorHeading={props.submissionErrorHeading}
        />
      )}
    </div>
  );
}

export default Form;
