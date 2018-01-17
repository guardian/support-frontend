// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Currency } from 'helpers/internationalisation/currency';
import { updateSortCode, updateAccountNumber, updateAccountHolderName, updateAccountHolderConfirmation } from 'components/directDebit/directDebitActions';


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
  <div>
    <dd className="mma-section__list--content">
      <img src="#" alt="The Direct Debit logo" />
    </dd>

    <SortCodeComponent
      value={props.sortCode}
      onChange={props.updateSortCode}
      valid={props.validSortCode}
    />

    <AccountNumber
      onChange={props.updateAccountNumber}
      value={props.accountNumber}
      valid={props.validAccountNumber}
    />

    <AccountHolder
      onChange={props.updateAccountHolderName}
      value={props.accountHolderName}
      valid={props.validAccountHolder}
    />

    <Confirmation
      checked={props.accountHolderConfirmation}
      onChange={props.updateAccountHolderConfirmation}
      valid={props.validDirectDebitConfirmed}
    />

    <dt className="mma-section__list--title">
        Advance notice
    </dt>
    <dd className="mma-section__list--content">
      <div className="mma-section__list--restricted u-note prose">
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
          <div>Tel: +44 (0) 330 333 6767</div>
          <div><a href="mailto:support@theguardian.com">support@theguardian.com</a></div>
        </div>
      </div>
    </dd>
  </div>);

// ----- Default Props ----- //

DirectDebitForm.defaultProps = {

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);


function SortCodeComponent(props: {valid: boolean, value: string, onChange: Function}) {
  const invalid = props.valid === false;
  return (
    <div>
      <dt className="mma-section__list--title">
        <label className="label" htmlFor="payment-sortcode">Sort code</label>
      </dt>
      <dd className="mma-section__list--content">
        <input
          value={props.value}
          onChange={props.onChange}
          type="text"
          className="input-text js-input"
          placeholder="00-00-00"
        />

        {invalid &&
        <p className="mma-error">
          Please enter a valid sort code
        </p>}
      </dd>
    </div>
  );
}


function AccountNumber(props: {valid: boolean, onChange: Function, value: string}) {
  const invalid = props.valid === false;

  return (
    <div>
      <dt className="mma-section__list--title">
        <label className="label" htmlFor="payment-account">Account number</label>
      </dt>
      <dd className="mma-section__list--content">
        <input
          value={props.value}
          onChange={props.onChange}
          name="payment.account"
          pattern="[0-9]*"
          minLength="6"
          maxLength="10"
          className="input-text"
        />
        {invalid &&
        <p className="mma-error">
          Please enter a valid bank account number
        </p>}
      </dd>
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
function AccountHolder(props: {valid: boolean, value: string, onChange: Function}) {
  const invalid = props.valid === false;

  return (
    <div>
      <dt className="mma-section__list--title">
        <label htmlFor="payment-holder">Account holder</label>
      </dt>
      <dd className="mma-section__list--content">
        <input
          value={props.value}
          onChange={props.onChange}
          className="input-text"
          maxLength="18"
        />
        {invalid &&
        <p className="mma-error">
          This field is required
        </p>}
      </dd>
    </div>
  );
}


function Confirmation(props: { checked: boolean, valid: boolean, onChange: Function }) {
  const invalid = props.valid === false;

  return (
    <div>
      <dt className="mma-section__list--title">
        Confirmation
      </dt>
      <dd className="mma-section__list--content">
        <div className="mma-section__list--restricted">
          <label className="option">
            <span className="option__input">
              <input
                type="checkbox"
                onChange={props.onChange}
                checked={props.checked}
              />
            </span>
            <span className="option__label">
              I confirm that I am the account holder and I am solely able to authorise debit from
              the account
            </span>
          </label>

          {invalid &&
          <p className="mma-error">
            Please confirm that you are the account holder
          </p>}
        </div>
      </dd>
    </div>
  );
}
