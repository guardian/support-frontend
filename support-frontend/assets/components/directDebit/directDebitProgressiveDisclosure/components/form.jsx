// @flow

// ----- Imports ----- //

import React from 'react';
import { compose } from 'redux';

import Button from 'components/button/button';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { Input } from 'components/forms/input';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { CheckboxInput } from 'components/forms/customFields/checkbox';
import { type ErrorReason } from 'helpers/errorReasons';
import { type Option } from 'helpers/types/option';

import '../directDebitForm.scss';

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
  allErrors: Array<Object>,
  formError: Option<string>,
  updateAccountHolderName: EventHandler,
  updateSortCodeString: EventHandler,
  updateAccountNumber: EventHandler,
  updateAccountHolderConfirmation: EventHandler,
  onChange: (field: string, dispatchUpdate: Function, event: SyntheticInputEvent<HTMLInputElement>) => void,
  onSubmit: EventHandler,
}

const InputWithError = compose(withError, withLabel)(Input);
const CheckBoxWithError = withError(CheckboxInput);

function Form(props: PropTypes) {
  return (
    <div className="component-direct-debit-form">
      <div className="component-direct-debit-form__account-holder-name">
        <InputWithError
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

      <div className="component-direct-debit-form__sort-code">
        <InputWithError
          id="sort-code-input"
          label="Sort code"
          autoComplete="off"
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

      <div className="component-direct-debit-form__account-number">
        <InputWithError
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

      <div className="component-direct-debit-form__confirmation-css-checkbox">
        <CheckBoxWithError
          id="account-holder-confirmation"
          onChange={e => props.onChange('accountHolderConfirmation', props.updateAccountHolderConfirmation, e)}
          checked={props.accountHolderConfirmation}
          text="I confirm that I am the account holder and I am solely able to authorise debit from
          the account"
          error={props.accountHolderConfirmationError}
        />
      </div>

      <Button
        id="qa-direct-debit-submit"
        onClick={e => props.onSubmit(e)}
      >
        Submit
      </Button>
      {(props.allErrors.length > 0 || props.accountErrorsLength > 0) && (
        <ErrorSummary
          errors={[
            ...props.allErrors,
            ...props.accountErrors,
          ]}
        />
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
