// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import {
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
  payDirectDebitClicked,
} from 'components/directDebit/directDebitActions';

import type { Currency } from 'helpers/internationalisation/currency';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  callback: Function,
  currency: Currency,
  isTestUser: boolean,
  sortCode: string,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateSortCode: (sortCode: string) => void,
  updateAccountNumber: (accountNumber: string) => void,
  updateAccountHolderName: (accountHolderName: string) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => void,
  payDirectDebitClicked: (callback: Function) => void,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.directDebit.isPopUpOpen,
    sortCode: state.page.directDebit.bankSortCode,
    accountNumber: state.page.directDebit.bankAccountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    payDirectDebitClicked: (callback) => {
      dispatch(payDirectDebitClicked(callback));
    },
    updateSortCode: (sortCode: string) => {
      dispatch(updateSortCode(sortCode));
    },
    updateAccountNumber: (accountNumber: string) => {
      dispatch(updateAccountNumber(accountNumber));
    },
    updateAccountHolderName: (accountHolderName: string) => {
      dispatch(updateAccountHolderName(accountHolderName));
    },
    updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => {
      dispatch(updateAccountHolderConfirmation(accountHolderConfirmation));
    },
  };

}

// ----- Component ----- //

const DirectDebitForm = (props: PropTypes) => (
  <div className="component-direct-debit-form">

    <img className="component-direct-debit-form__direct-debit-logo" src="#" alt="The Direct Debit logo" />


    <SortCodeInput
      value={props.sortCode}
      onChange={props.updateSortCode}
    />

    <AccountNumberInput
      onChange={props.updateAccountNumber}
      value={props.accountNumber}
    />

    <AccountHolderNameInput
      onChange={props.updateAccountHolderName}
      value={props.accountHolderName}
    />

    <ConfirmationInput
      checked={props.accountHolderConfirmation}
      onChange={props.updateAccountHolderConfirmation}
    />

    <div className="component-direct-debit-form__advance-notice__title">
        Advance notice
    </div>

    <button
      id="qa-pay-with-direct-debit-close-pop-up"
      className="component-direct-debit-pop-up-form"
      onClick={props.payDirectDebitClicked}
    >
      Pay
    </button>
    <div className="component-direct-debit-form__advance-notice__content">
      <p>The details of your Direct Debit instruction including payment schedule, due date,
        frequency and amount will be sent to you within three working days. All the normal
        Direct Debit safeguards and guarantees apply.
      </p>
      <p>
        Your payments are protected by the <a target="_blank" rel="noopener noreferrer" href="https://www.directdebit.co.uk/DirectDebitExplained/pages/directdebitguarantee.aspx">Direct Debit guarantee</a>.
      </p>
      <div>
        <div>The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch, LE65 1JT
          United Kingdom
        </div>
        <div><a href="tel:+443303336767">Tel: +44 (0) 330 333 6767</a></div>
        <div><a href="mailto:support@theguardian.com">support@theguardian.com</a></div>
      </div>
    </div>
  </div>);

// ----- Default Props ----- //

DirectDebitForm.defaultProps = {

};


// ----- Auxiliary components ----- //

function SortCodeInput(props: {value: string, onChange: Function}) {
  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input">
        Sort code
        <input
          id="sort-code-input"
          value={props.value}
          onChange={props.onChange}
          type="text"
          placeholder="00-00-00"
        />
      </label>
    </div>
  );
}


function AccountNumberInput(props: {onChange: Function, value: string}) {
  return (
    <div className="component-direct-debit-form__account-number">
      <label htmlFor="account-number-input">
        Account number
        <input
          id="account-number-input"
          value={props.value}
          onChange={props.onChange}
          pattern="[0-9]*"
          minLength="6"
          maxLength="10"
        />
      </label>
    </div>
  );
}

/*
 * BACS requirement:
 "The payer’s account name (maximum of 18 characters).
 This must be the name of the person who is paying the Direct Debit
 and has signed the Direct Debit Instruction (DDI)."
 http://www.bacs.co.uk/Bacs/Businesses/Resources/Pages/Glossary.aspx
 * */
function AccountHolderNameInput(props: {value: string, onChange: Function}) {
  return (
    <div className="component-direct-debit-form__account-holder-name">
      <label htmlFor="account-holder-name-input">
        Account holder name
        <input
          id="account-holder-name-input"
          value={props.value}
          onChange={props.onChange}
          maxLength="18"
        />
      </label>
    </div>
  );
}

function ConfirmationInput(props: { checked: boolean, onChange: Function }) {
  return (
    <div className="component-direct-debit-form__account-holder-confirmation">
      Confirmation
      <div>
        <label htmlFor="confirmation-input">
          <span>
            <input
              id="confirmation-input"
              type="checkbox"
              onChange={props.onChange}
              checked={props.checked}
            />
          </span>
          <span>
            I confirm that I am the account holder and I am solely able to authorise debit from
            the account
          </span>
        </label>
      </div>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
