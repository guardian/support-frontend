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
import { SvgDirectDebitSymbol, SvgArrowRightStraight, SvgExclamationAlternate } from 'components/svg/svg';

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
    updateSortCode: (value: string) => {
      dispatch(updateSortCode(value));
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
      value={props.sortCode}
    />

    <ConfirmationInput
      onChange={props.updateAccountHolderConfirmation}
      checked={props.accountHolderConfirmation}
    />

    <button
      id="qa-pay-with-direct-debit-pay"
      className="component-direct-debit-form__pay-button"
      onClick={() => props.payDirectDebitClicked(props.callback)}
    >
      <SvgDirectDebitSymbol />
      <span>Contribute with Direct Debit</span>
      <SvgArrowRightStraight />
    </button>

    <ErrorMessage message={props.formError} svg={<SvgExclamationAlternate />} />

    <div className="component-direct-debit-form__legal__content">
      <p><strong>Advance notice</strong> The details of your Direct Debit instruction including
        payment schedule, due date, frequency and amount will be sent to you within three working
        days.
        All payments are protected by the&nbsp;
        <a className="component-direct-debit-form__legal__link" target="_blank" rel="noopener noreferrer" href="https://www.directdebit.co.uk/DirectDebitExplained/pages/directdebitguarantee.aspx">
          Direct Debit guarantee
        </a>.
      </p>
    </div>
  </div>
);


// ----- Auxiliary components ----- //

type SortCodePropTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

class SortCodeInput extends React.Component<SortCodePropTypes> {
  constructor(props: {value: string, onChange: Function}) {
    super(props);
    const split = props.value.match(/.{1,2}/g);
    this.state = {
      sortCodeValues: split || Array(3).fill(''),
      onChange: props.onChange,
      sortCodeInputs: Array(3),
    };
  }

  setFocus(index: number) {
    if (this.state.sortCodeValues[index].length === 2 && index < 2) {
      this.state.sortCodeInputs[index + 1].focus();
    }
  }

  handleUpdate(index: number, event: SyntheticInputEvent<HTMLInputElement>) {
    this.state.sortCodeValues[index] = event.target.value;
    this.state.onChange(this.state.sortCodeValues.join(''));
    this.setFocus(index);
  }

  render() {
    return (
      <div className="component-direct-debit-form__sort-code">
        <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
          Sort Code
        </label>
        <input
          id="sort-code-input-1"
          value={this.state.sortCodeValues[0]}
          onChange={value => this.handleUpdate(0, value)}
          ref={(input) => { this.state.sortCodeInputs[0] = input; }}
          type="text"
          className="component-direct-debit-form__sort-code-field"
        /><span className="component-direct-debit-form_sort-code-separator">&mdash;</span>
        <input
          id="sort-code-input-2"
          value={this.state.sortCodeValues[1]}
          onChange={value => this.handleUpdate(1, value)}
          ref={(input) => { this.state.sortCodeInputs[1] = input; }}
          type="text"
          className="component-direct-debit-form__sort-code-field"
        /><span className="component-direct-debit-form_sort-code-separator">&mdash;</span>
        <input
          id="sort-code-input-3"
          value={this.state.sortCodeValues[2]}
          onChange={value => this.handleUpdate(2, value)}
          ref={(input) => { this.state.sortCodeInputs[2] = input; }}
          type="text"
          className="component-direct-debit-form__sort-code-field"
        />

      </div>
    );
  }
}

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
        Name
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
          <div className="fancy-checkbox">
            <input
              className="component-direct-debit-form__account-holder-confirmation__checkbox"
              id="confirmation-input"
              type="checkbox"
              onChange={props.onChange}
              checked={props.checked}
            />
            <label htmlFor="confirmation-input" />
          </div>
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
