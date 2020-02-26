// @flow

// ----- Imports ----- //

import React from 'react';

import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';


function Playback(props: {
  editDirectDebitClicked: Function,
  submitForm: Function,
  accountHolderName: string,
  accountNumber: string,
  sortCodeString: string,
  buttonText: string,
}) {
  return (
    <div className="component-direct-debit-form">
      <label htmlFor="account-holder-name-input" className="component-direct-debit-form__field-label">
        Account name
      </label>
      <span>
        {props.accountHolderName}
      </span>

      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Sort Code
      </label>
      <span>
        {props.sortCodeString}
      </span>

      <label htmlFor="account-number-input" className="component-direct-debit-form__field-label">
        Account number
      </label>
      <span>
        {props.accountNumber}
      </span>

      <label htmlFor="confirmation-text__locked" className="component-direct-debit-form__field-label">
        Declaration
      </label>
      <div id="confirmation-text__locked" className="component-direct-debit-form__confirmation-text__locked">
        I have confirmed that I am the account holder and that I am solely able to authorise debit
        from the account
      </div>
      <div className="component-direct-debit-form__confirmation-guidance">
        If the details above are correct press confirm to set up your direct debit, otherwise press
        back to make changes
      </div>

      <div className="component-direct-debit-form__cta-container">
        <button
          className="component-direct-debit-form__cta component-direct-debit-form__cta--edit-button focus-target"
          onClick={props.editDirectDebitClicked}
        >
          <span className="component-direct-debit-form__cta-text component-direct-debit-form__cta-text--inverse">Edit</span>
        </button>
        <button
          id="qa-submit-button-2"
          className="component-direct-debit-form__cta component-direct-debit-form__cta--confirm-button focus-target"
          onClick={() => props.submitForm()}
        >
          <span className="component-direct-debit-form__cta-text">{props.buttonText}</span>
          <div className="component-direct-debit-form__arrow"><SvgArrowRightStraight /></div>
        </button>
      </div>

    </div>
  );
}

export default Playback;
