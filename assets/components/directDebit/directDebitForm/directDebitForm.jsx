// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import ErrorMessage from 'components/errorMessage/errorMessage';
import SortCodeInput from 'components/directDebit/directDebitForm/sortCodeInput';
import {
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
  payDirectDebitClicked,
} from 'components/directDebit/directDebitActions';
import type { SortCodeIndex } from 'components/directDebit/directDebitActions';
import { SvgDirectDebitSymbol, SvgArrowRightStraight, SvgExclamationAlternate } from 'components/svg/svg';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  sortCodeArray: Array<string>,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateSortCode: (index: SortCodeIndex, event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: string) => void,
  updateAccountHolderName: (accountHolderName: string) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => void,
  payDirectDebitClicked: (callback: Function) => void,
  formError: string,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.directDebit.isPopUpOpen,
    sortCodeArray: state.page.directDebit.sortCodeArray,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
    formError: state.page.directDebit.formError,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    payDirectDebitClicked: (callback) => {
      dispatch(payDirectDebitClicked(callback));
    },
    updateSortCode: (index: SortCodeIndex, event: SyntheticInputEvent<HTMLInputElement>) => {
      dispatch(updateSortCode(index, event.target.value));
    },
    updateAccountNumber: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountNumber: string = event.target.value;
      dispatch(updateAccountNumber(accountNumber));
    },
    updateAccountHolderName: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountHolderName: string = event.target.value;
      dispatch(updateAccountHolderName(accountHolderName));
    },
    updateAccountHolderConfirmation: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountHolderConfirmation: boolean = event.target.checked;
      dispatch(updateAccountHolderConfirmation(accountHolderConfirmation));
    },
  };

}

// ----- Component ----- //

const DirectDebitForm = (props: PropTypes) => (
  <div className="component-direct-debit-form">

    <AccountHolderNameInput
      onChange={props.updateAccountHolderName}
      value={props.accountHolderName}
    />

    <AccountNumberInput
      onChange={props.updateAccountNumber}
      value={props.accountNumber}
    />

    <SortCodeInput
      onChange={props.updateSortCode}
      sortCodeArray={props.sortCodeArray}
    />

    <ConfirmationInput
      onChange={props.updateAccountHolderConfirmation}
      checked={props.accountHolderConfirmation}
    />

    <PaymentButton
      onClick={() => props.payDirectDebitClicked(props.callback)}
    />

    <ErrorMessage
      message={props.formError}
      svg={<SvgExclamationAlternate />}
    />

    <LegalNotice />
  </div>
);


// ----- Auxiliary components ----- //

function AccountNumberInput(props: {onChange: Function, value: string}) {
  return (
    <div className="component-direct-debit-form__account-number">
      <label htmlFor="account-number-input" className="component-direct-debit-form__field-label">
        Account number
      </label>
      <input
        id="account-number-input"
        value={props.value}
        onChange={props.onChange}
        pattern="[0-9]*"
        minLength="6"
        maxLength="10"
        className="component-direct-debit-form__text-field focus-target"
      />
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
function AccountHolderNameInput(props: {value: string, onChange: Function}) {
  return (
    <div className="component-direct-debit-form__account-holder-name">
      <label htmlFor="account-holder-name-input" className="component-direct-debit-form__field-label">
        Name
      </label>
      <input
        id="account-holder-name-input"
        value={props.value}
        onChange={props.onChange}
        maxLength="18"
        className="component-direct-debit-form__text-field focus-target"
      />
    </div>
  );
}

function ConfirmationInput(props: { checked: boolean, onChange: Function }) {
  return (
    <div className="component-direct-debit-form__account-holder-confirmation">
      <div>
        <label htmlFor="confirmation-input">
          <div className="component-direct-debit-form__confirmation-css-checkbox">
            <input
              className="component-direct-debit-form__confirmation-input"
              id="confirmation-input"
              type="checkbox"
              onChange={props.onChange}
              checked={props.checked}
            />
            <label
              className="component-direct-debit-form__confirmation-label"
              htmlFor="confirmation-input"
            />
          </div>
          <span className="component-direct-debit-form__confirmation-text">
            I confirm that I am the account holder and I am solely able to authorise debit from
            the account
          </span>
        </label>
      </div>
    </div>
  );
}

function PaymentButton(props: {onClick: Function}) {
  return (
    <button
      id="qa-pay-with-direct-debit-pay"
      className="component-direct-debit-form__pay-button focus-target"
      onClick={props.onClick}
    >
      <SvgDirectDebitSymbol />
      <span>Contribute with Direct Debit</span>
      <SvgArrowRightStraight />
    </button>
  );
}

function LegalNotice() {
  return (
    <div className="component-direct-debit-form__legal-notice">
      <p><strong>Advance notice</strong> The details of your Direct Debit instruction including
        payment schedule, due date, frequency and amount will be sent to you within three working
        days.
        All payments are protected by the&nbsp;
        <a target="_blank" rel="noopener noreferrer" href="https://www.directdebit.co.uk/DirectDebitExplained/pages/directdebitguarantee.aspx">
          Direct Debit guarantee
        </a>.
      </p>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
