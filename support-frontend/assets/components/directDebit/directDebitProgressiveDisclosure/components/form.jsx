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

import '../directDebitForm.scss';


const InputWithError = compose(withError, withLabel)(Input);
const CheckBoxWithError = withError(CheckboxInput);

function Form(props: {
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
  formError: ErrorReason | null,
  formErrorHeading: string,
  allErrors: Array<Object>,
  updateAccountHolderName: (accountHolderName: SyntheticInputEvent<HTMLInputElement>) => void,
  updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: SyntheticInputEvent<HTMLInputElement>) => void,
  onChange: (field: string, dispatchUpdate: Function, event: SyntheticInputEvent<HTMLInputElement>) => void,
  onSubmit: (event: SyntheticInputEvent<HTMLInputElement>) => void,
}) {
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
          minLength="6"
          maxLength="10"
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
          errorReason={props.formError}
          errorHeading={props.formErrorHeading}
        />
      )}
    </div>
  );
}

export default Form;
