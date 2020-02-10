// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, type Dispatch } from 'redux';
import {
  type Action,
  payDirectDebitWithoutConfirmation,
  updateAccountHolderName,
  updateAccountNumber,
  updateSortCodeString,
  confirmDirectDebitClicked,
} from 'components/directDebit/directDebitActions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import './directDebitForm.scss';
import Button from 'components/button/button';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import { Input } from 'components/forms/input';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import type { ErrorReason } from 'helpers/errorReasons';


// ---- Types ----- //

type PropTypes = {|
  /* eslint-disable react/no-unused-prop-types */
  buttonText: string,
  cardError: ErrorReason | null,
  cardErrorHeading: string,
  allErrors: Array<Object>,
  sortCodeString: string,
  accountNumber: string,
  accountHolderName: string,
  updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderName: (accountHolderName: SyntheticInputEvent<HTMLInputElement>) => void,
  formError: string,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  submitForm: Function,
  validateForm: Function,
  payDirectDebitWithoutConfirmation: () => void,
  confirmDirectDebitClicked: (onPaymentAuthorisation: PaymentAuthorisation => void) => void,
|};

type StateTypes = {
  accountHolderName: Object,
  sortCodeString: Object,
  accountNumber: Object,
}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    sortCodeString: state.page.directDebit.sortCodeString,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
    formError: state.page.directDebit.formError,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    payDirectDebitWithoutConfirmation: () => {
      dispatch(payDirectDebitWithoutConfirmation());
      return false;
    },
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

const InputWithError = compose(withError, withLabel)(Input);


// ----- Component ----- //

class DirectDebitForm extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      accountHolderName: {
        error: '',
        message: 'Please enter a valid account name',
        rule: accountHolderName => accountHolderName.match(/^\D+$/),
      },
      sortCodeString: {
        error: '',
        message: 'Please enter a valid sort code',
        rule: sortCodeString => sortCodeString.match(/^\d{6}$/),
      },
      accountNumber: {
        error: '',
        message: 'Please enter a valid account number',
        rule: accountNumber => accountNumber.match(/^\d{6,10}$/),
      },
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { props } = this;
    const cardErrors = this.getCardErrorsLength(this.getCardErrors()) > 0;
    props.validateForm();
    this.handleErrors();
    if (props.allErrors.length === 0 && !cardErrors) {
      this.payDirectDebit(props.onPaymentAuthorisation);
      props.submitForm();
    }
  };

  onChange = (field, onChange, event) => {
    this.setState({
      [field]: {
        ...this.state[field],
        error: '',
      },
    });
    onChange(event);
  }

  getCardErrors = () => {
    const { state } = this;
    const cardErrors = ['accountHolderName', 'sortCodeString', 'accountNumber'].map(field => ({ message: state[field].error }));
    return cardErrors;
  }

  getCardErrorsLength = cardErrors => cardErrors.reduce((accum, error) => {
    if (error.message.length > 0) {
      return accum + 1;
    }
    return accum;
  }, 0)

  handleErrors = () => {
    const { props, state } = this;
    ['accountHolderName', 'sortCodeString', 'accountNumber'].forEach((field) => {
      if (!state[field].rule(props[field])) {
        this.setState({
          [field]: {
            ...state[field],
            error: state[field].message,
          },
        });
      }
    });
  };

  payDirectDebit = (onPaymentAuthorisation: PaymentAuthorisation => void) => {
    const { props } = this;
    props.payDirectDebitWithoutConfirmation();
    props.confirmDirectDebitClicked(onPaymentAuthorisation);
    return false;
  }

  render() {
    const { props, state } = this;
    const cardErrors = this.getCardErrors();
    const cardErrorsLength = this.getCardErrorsLength(cardErrors);
    const showGeneralError = props.allErrors.length === 0 && cardErrorsLength === 0 &&
      (props.cardError && props.cardError !== 'personal_details_incorrect');

    return (
      <div className="component-direct-debit-form">
        <div className="component-direct-debit-form__account-holder-name">
          <InputWithError
            id="account-holder-name-input"
            value={props.accountHolderName}
            onChange={e => this.onChange('accountHolderName', props.updateAccountHolderName, e)}
            maxLength="40"
            className="component-direct-debit-form__text-field focus-target"
            label="Bank account holder name"
            error={state.accountHolderName.error}
          />
        </div>

        <div className="component-direct-debit-form__sort-code">
          <InputWithError
            id="sort-code-input"
            label="Sort code"
            value={props.sortCodeString}
            onChange={e => this.onChange('sortCodeString', props.updateSortCodeString, e)}
            error={state.sortCodeString.error}
            minLength={6}
            maxLength={6}
            className="component-direct-debit-form__sort-code-field focus-target component-direct-debit-form__text-field"
          />
        </div>

        <div className="component-direct-debit-form__account-number">
          <InputWithError
            id="account-number-input"
            value={props.accountNumber}
            onChange={e => this.onChange('accountNumber', props.updateAccountNumber, e)}
            minLength="6"
            maxLength="10"
            className="component-direct-debit-form__text-field focus-target"
            label="Account number"
            error={state.accountNumber.error}
          />
        </div>

        <Button
          id="qa-direct-debit-submit"
          onClick={event => this.onSubmit(event)}
        >
          {props.buttonText}
        </Button>
        {(props.allErrors.length > 0) && (
          <ErrorSummary
            errors={[
              ...props.allErrors,
              ...cardErrors,
            ]}
          />
        )}
        {showGeneralError && (
        <GeneralErrorMessage
          errorReason={props.cardError}
          errorHeading={props.cardErrorHeading}
        />
          )}
      </div>
    );
  }
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
