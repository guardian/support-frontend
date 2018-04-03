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
  confirmDirectDebitClicked,
  openDirectDebitGuarantee,
  closeDirectDebitGuarantee,
  payDirectDebitClicked,
  setDirectDebitFormPhase,
} from 'components/directDebit/directDebitActions';
import type { SortCodeIndex, Phase } from 'components/directDebit/directDebitActions';
import {
  SvgDirectDebitSymbol,
  SvgDirectDebitSymbolAndText,
  SvgArrowRightStraight,
  SvgArrowLeftStraight,
  SvgExclamationAlternate,
} from 'components/svg/svg';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  isDDGuaranteeOpen: boolean,
  sortCodeArray: Array<string>,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateSortCode: (index: SortCodeIndex, event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: string) => void,
  updateAccountHolderName: (accountHolderName: string) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => void,
  openDDGuaranteeClicked: () => void,
  closeDDGuaranteeClicked: () => void,
  formError: string,
  phase: Phase,
  payDirectDebitClicked: () => void,
  editDirectDebitClicked: () => void,
  confirmDirectDebitClicked: (callback: Function) => void,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isDDGuaranteeOpen: state.page.directDebit.isDDGuaranteeOpen,
    sortCodeArray: state.page.directDebit.sortCodeArray,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
    formError: state.page.directDebit.formError,
    phase: state.page.directDebit.phase,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    payDirectDebitClicked: () => {
      dispatch(payDirectDebitClicked());
      return false;
    },
    editDirectDebitClicked: () => {
      dispatch(setDirectDebitFormPhase('entry'));
    },
    confirmDirectDebitClicked: (callback) => {
      dispatch(confirmDirectDebitClicked(callback));
      return false;
    },
    openDDGuaranteeClicked: () => {
      dispatch(openDirectDebitGuarantee());
    },
    closeDDGuaranteeClicked: () => {
      dispatch(closeDirectDebitGuarantee());
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
      phase={props.phase}
      onChange={props.updateAccountHolderName}
      value={props.accountHolderName}
    />

    <AccountNumberInput
      phase={props.phase}
      onChange={props.updateAccountNumber}
      value={props.accountNumber}
    />

    <SortCodeInput
      phase={props.phase}
      onChange={props.updateSortCode}
      sortCodeArray={props.sortCodeArray}
    />

    <ConfirmationInput
      phase={props.phase}
      onChange={props.updateAccountHolderConfirmation}
      checked={props.accountHolderConfirmation}
    />

    <PaymentButton
      phase={props.phase}
      onPayClick={() => props.payDirectDebitClicked()}
      onEditClick={() => props.editDirectDebitClicked()}
      onConfirmClick={() => props.confirmDirectDebitClicked(props.callback)}
    />

    <ErrorMessage
      message={props.formError}
      svg={<SvgExclamationAlternate />}
    />

    <LegalNotice
      isDDGuaranteeOpen={props.isDDGuaranteeOpen}
      openDDGuaranteeClicked={props.openDDGuaranteeClicked}
      closeDDGuaranteeClicked={props.closeDDGuaranteeClicked}
    />
  </div>
);


// ----- Auxiliary components ----- //

function AccountNumberInput(props: {phase: string, onChange: Function, value: string}) {
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
function AccountHolderNameInput(props: {phase: string, value: string, onChange: Function}) {
  const editable = (
    <input
      id="account-holder-name-input"
      value={props.value}
      onChange={props.onChange}
      maxLength="18"
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
        Name
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>
  );
}

function ConfirmationInput(props: {phase: string, checked: boolean, onChange: Function }) {
  const editable = (
    <span>
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
    </span>
  );

  const locked = (
    <span>
      <label htmlFor="confirmation-text__locked" className="component-direct-debit-form__field-label">
        Declaration
      </label>
      <div id="confirmation-text__locked" className="component-direct-debit-form__confirmation-text__locked">
        I have confirmed that I am the account holder and that I am solely able to authorise debit
        from the account
      </div>
      <div className="component-direct-debit-form__confirmation-guidance">
        If the details above are correct press confirm to set up your direct debit, otherwise press
        edit to go back and make changes
      </div>
    </span>
  );

  return (
    <div className="component-direct-debit-form__account-holder-confirmation">
      <div>
        <label htmlFor="confirmation-input">
          {props.phase === 'entry' ? editable : locked}
        </label>
      </div>
    </div>
  );
}

function PaymentButton(props: {
  phase: string,
  onPayClick: Function,
  onEditClick: Function,
  onConfirmClick: Function
}) {
  if (props.phase === 'entry') {
    return (
      <button
        id="qa-pay-with-direct-debit-pay"
        className="component-direct-debit-form__cta component-direct-debit-form__pay-button focus-target"
        onClick={props.onPayClick}
      >
        <SvgDirectDebitSymbol />
        <span className="component-direct-debit-form__cta-text">Contribute with Direct Debit</span>
        <SvgArrowRightStraight />
      </button>
    );
  }
  if (props.phase === 'confirmation') {
    return (
      <span>
        <button
          id="qa-pay-with-direct-debit-edit"
          className="component-direct-debit-form__cta component-direct-debit-form__edit-button focus-target"
          onClick={props.onEditClick}
        >
          <SvgArrowLeftStraight />
          <span className="component-direct-debit-form__cta-text inverse">Edit</span>
        </button>
        <button
          id="qa-pay-with-direct-debit-confirm"
          className="component-direct-debit-form__cta component-direct-debit-form__confirm-button focus-target"
          onClick={props.onConfirmClick}
        >
          <span className="component-direct-debit-form__cta-text">Confirm</span>
          <SvgArrowRightStraight />
        </button>
      </span>
    );
  }
}

function LegalNotice(props: {
  isDDGuaranteeOpen: boolean,
  openDDGuaranteeClicked: () => void,
  closeDDGuaranteeClicked: () => void}) {
  return (
    <div className="component-direct-debit-form__legal-notice">
      <p><strong>Advance notice</strong> The details of your Direct Debit instruction including
        payment schedule, due date, frequency and amount will be sent to you within three working
        days. All the normal Direct Debit safeguards and guarantees apply.
      </p>
      <strong>Direct Debit</strong>
      <p>
        The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch,
        LE65 1JT United Kingdom<br />
        Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
        8am-6pm at weekends (GMT/BST)<br />
        <a href="mailto:contribution.support@theguardian.com">contribution.support@theguardian.com</a>
      </p>
      <SvgDirectDebitSymbolAndText />
      <p>
        Your payments are protected by the&nbsp;
        <button className="component-direct-debit-form__open-link" onClick={props.isDDGuaranteeOpen ? props.closeDDGuaranteeClicked : props.openDDGuaranteeClicked}>
          Direct Debit guarantee
        </button>.
        <div>
          <ul className={`component-direct-debit-form__guarantee-list ${props.isDDGuaranteeOpen ? '' : 'component-direct-debit-form__guarantee-list--closed'}`}>
            <li>
              The Guarantee is offered by all banks and building societies that accept instructions
              to pay Direct Debits
            </li>
            <li>
              If there are any changes to the amount, date or frequency of your Direct Debit
              Guardian News & Media Ltd will notify you at least three working days in advance of
              your account being debited or as otherwise agreed.
            </li>
            <li>
              If you ask Guardian News & Media Ltd to collect a payment, confirmation of the amount
              and date will be given to you at the time of the request.
            </li>
            <li>
              If an error is made in the payment of your Direct Debit by Guardian News & Media Ltd
              or your bank or building society, you are entitled to a full and immediate refund of
              the amount paid from your bank or building society.
            </li>
            <li>
              If you receive a refund you are not entitled to, you must pay it back when Guardian
              News & Media Ltd asks you to.
            </li>
            <li>
              You can cancel a Direct Debit at any time by contacting your bank or building society.
              Written confirmation may be required. Please also notify us.
            </li>
          </ul>
        </div>
      </p>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
