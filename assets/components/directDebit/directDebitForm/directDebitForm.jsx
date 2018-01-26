// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import ErrorMessage from 'components/errorMessage/errorMessage';
import {
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
  payDirectDebitClicked,
} from 'components/directDebit/directDebitActions';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  sortCode: string,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateSortCode: (sortCode: string) => void,
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
    sortCode: state.page.directDebit.bankSortCode,
    accountNumber: state.page.directDebit.bankAccountNumber,
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
    updateSortCode: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const sortCode: string = event.target.value;
      dispatch(updateSortCode(sortCode));
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

const DirectDebitForm = (props: PropTypes) => {
  let errorMessage = null;
  if (props.formError) {
    errorMessage = <ErrorMessage message={props.formError} />;
  }
  return (
    <div className="component-direct-debit-form">
      <SortCodeInput
        onChange={props.updateSortCode}
        value={props.sortCode}
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
        onChange={props.updateAccountHolderConfirmation}
        checked={props.accountHolderConfirmation}
      />

      {errorMessage}
      <button
        id="qa-pay-with-direct-debit-pay"
        className="component-direct-debit-form__pay-button"
        onClick={() => props.payDirectDebitClicked(props.callback)}
      >
        Pay with Direct Debit
      </button>

      <div className="component-direct-debit-form__legal__title">
        Advance notice
      </div>

      <div className="component-direct-debit-form__legal__content">
        <p>The details of your Direct Debit instruction including payment schedule, due date,
          frequency and amount will be sent to you within three working days. All the normal
          Direct Debit safeguards and guarantees apply.
        </p>
        <p>
          Your payments are protected by the&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://www.directdebit.co.uk/DirectDebitExplained/pages/directdebitguarantee.aspx">
            Direct Debit guarantee
          </a>.
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
};


// ----- Auxiliary components ----- //

function SortCodeInput(props: {value: string, onChange: Function}) {
  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Bank sort code
      </label>
      <input
        id="sort-code-input"
        value={props.value}
        onChange={props.onChange}
        type="text"
        placeholder="00-00-00"
        className="component-direct-debit-form__sort-code-field"
      />

    </div>
  );
}


function AccountNumberInput(props: {onChange: Function, value: string}) {
  return (
    <div className="component-direct-debit-form__account-number">
      <label htmlFor="account-number-input" className="component-direct-debit-form__field-label">
        Bank account number
      </label>
      <input
        id="account-number-input"
        value={props.value}
        onChange={props.onChange}
        pattern="[0-9]*"
        minLength="6"
        maxLength="10"
        className="component-direct-debit-form__text-field"
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
        Name of account holder
      </label>
      <input
        id="account-holder-name-input"
        value={props.value}
        onChange={props.onChange}
        maxLength="18"
        className="component-direct-debit-form__text-field"
      />
    </div>
  );
}

function ConfirmationInput(props: { checked: boolean, onChange: Function }) {
  return (
    <div className="component-direct-debit-form__account-holder-confirmation">
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
          <span className="component-direct-debit-form__account-holder-confirmation__text">
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
