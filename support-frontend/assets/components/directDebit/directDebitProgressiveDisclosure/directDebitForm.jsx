// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import {
  type Action,
  type Phase,
  confirmDirectDebitClicked,
  updateAccountHolderName,
  updateAccountNumber,
  updateSortCodeString,
} from 'components/directDebit/directDebitActions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import './directDebitForm.scss';
import Button from 'components/button/button';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';

// ---- Types ----- //

type PropTypes = {|
  buttonText: string,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  sortCodeString: string,
  accountNumber: string,
  accountHolderName: string,
  updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderName: (accountHolderName: SyntheticInputEvent<HTMLInputElement>) => void,
  formError: string,
  phase: Phase,
  confirmDirectDebitClicked: (onPaymentAuthorisation: PaymentAuthorisation => void) => void,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    sortCodeString: state.page.directDebit.sortCodeString,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
    formError: state.page.directDebit.formError,
    phase: state.page.directDebit.phase,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    confirmDirectDebitClicked: (onPaymentAuthorisation: PaymentAuthorisation => void) => {
      dispatch(confirmDirectDebitClicked(onPaymentAuthorisation));
      return false;
    },
    updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => {
      dispatch(updateSortCodeString(event.target.value));
    },
    updateAccountNumber: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountNumber: string = event.target.value;
      dispatch(updateAccountNumber(accountNumber));
    },
    updateAccountHolderName: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountHolderName: string = event.target.value;
      dispatch(updateAccountHolderName(accountHolderName));
    },
  };

}

// ----- Component ----- //

const DirectDebitForm = (props: PropTypes) => (
  <div className="component-direct-debit-form">

    <AccountHolderNameInput
      phase={props.phase}
      onChange={props.updateAccountHolderName}
      value={props.accountHolderName}
    />

    <SortCodeInput
      phase={props.phase}
      onChange={props.updateSortCodeString}
      value={props.sortCodeString}
    />

    <AccountNumberInput
      phase={props.phase}
      onChange={props.updateAccountNumber}
      value={props.accountNumber}
    />

    <Button id="qa-direct-debit-submit" onClick={() => props.confirmDirectDebitClicked(props.onPaymentAuthorisation)}>
      {props.buttonText}
    </Button>
    {(props.formError.length > 0)
    && <ErrorSummary errors={[{ message: props.formError }]} />}
  </div>
);


// ----- Auxiliary components ----- //

function AccountNumberInput(props: {phase: Phase, onChange: Function, value: string}) {
  const editable = (
    <input
      id="account-number-input"
      value={props.value}
      onChange={props.onChange}
      pattern="[0-9]*"
      minLength="6"
      maxLength="10"
      className="component-direct-debit-form__text-field focus-target"
    />
  );
  const locked = (
    <span>
      {props.value}
    </span>
  );
  return (
    <div className="component-direct-debit-form__account-number">
      <label htmlFor="account-number-input" className="component-direct-debit-form__field-label">
        Account number
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>
  );
}

/*
 * BACS requirement:
 "Name of the account holder, as known by the bank. Usually this is the
 same as the name stored with the linked creditor. This field will be
 transliterated, upcased and truncated to 18 characters."
 https://developer.gocardless.com/api-reference/
 * */
function AccountHolderNameInput(props: {phase: Phase, value: string, onChange: Function}) {
  const editable = (
    <input
      id="account-holder-name-input"
      value={props.value}
      onChange={props.onChange}
      maxLength="40"
      className="component-direct-debit-form__text-field focus-target"
    />
  );

  const locked = (
    <span>
      {props.value}
    </span>
  );

  return (
    <div className="component-direct-debit-form__account-holder-name">
      <label htmlFor="account-holder-name-input" className="component-direct-debit-form__field-label">
        Bank account holder name
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>
  );
}

type SortCodePropTypes = {
  value: string,
  phase: Phase,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
};

function SortCodeInput(props: SortCodePropTypes) {
  const editable = (
    <input
      id="sort-code-input"
      value={props.value}
      onChange={props.onChange}
      pattern="[0-9][0-9][0-9][0-9][0-9][0-9]"
      minLength={6}
      maxLength={6}
      className="component-direct-debit-form__sort-code-field focus-target component-direct-debit-form__text-field"
    />
  );

  const locked = (
    <span>
      {props.value}
    </span>
  );

  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Sort code
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>
  );
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
