// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import {
  type Action,
  type Phase,
  confirmDirectDebitClicked,
  payDirectDebitClicked,
  setDirectDebitFormPhase,
  updateAccountHolderName,
  updateAccountNumber,
  updateSortCodeString,
  updateAccountHolderConfirmation,
} from 'components/directDebit/directDebitActions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import './directDebitForm.scss';
import type { ErrorReason } from 'helpers/errorReasons';
import Form from './components/form';
import Playback from './components/playback';


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
  accountHolderConfirmation: boolean,
  updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderName: (accountHolderName: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: SyntheticInputEvent<HTMLInputElement>) => void,
  formError: string,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  submitForm: Function,
  validateForm: Function,
  payDirectDebitClicked: () => void,
  editDirectDebitClicked: () => void,
  confirmDirectDebitClicked: (onPaymentAuthorisation: PaymentAuthorisation => void) => void,
  countryGroupId: CountryGroupId,
  phase: Phase,
|};

type StateTypes = {
  accountHolderName: Object,
  sortCodeString: Object,
  accountNumber: Object,
  accountHolderConfirmation: Object,
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
    phase: state.page.directDebit.phase,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    payDirectDebitClicked: () => {
      dispatch(payDirectDebitClicked());
      return false;
    },
    editDirectDebitClicked: () => {
      dispatch(setDirectDebitFormPhase('entry'));
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
    updateAccountHolderConfirmation: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountHolderConfirmation: boolean = event.target.checked;
      dispatch(updateAccountHolderConfirmation(accountHolderConfirmation));
    },
  };

}

const fieldNames = [
  'accountHolderName',
  'sortCodeString',
  'accountNumber',
  'accountHolderConfirmation',
];


// ----- Component ----- //

class DirectDebitForm extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      accountHolderName: {
        error: '',
        message: 'Please enter a valid account name',
        // Regex matches a string with any character that is not a digit
        rule: accountHolderName => accountHolderName.match(/^\D+$/),
      },
      sortCodeString: {
        error: '',
        message: 'Please enter a valid sort code',
        // Regex matches a string with exactly 6 digits
        rule: sortCodeString => sortCodeString.match(/^\d{6}$/),
      },
      accountNumber: {
        error: '',
        message: 'Please enter a valid account number',
        // Regex matches a string with between 6 and 10 digits
        rule: accountNumber => accountNumber.match(/^\d{6,10}$/),
      },
      accountHolderConfirmation: {
        error: '',
        message: 'Please confirm you are the account holder',
        rule: accountHolderConfirmation => accountHolderConfirmation === true,
      },
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const cardErrors = this.validateForm();
    if (this.props.allErrors.length === 0 && !cardErrors) {
      this.props.payDirectDebitClicked();
    }
  }

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
    const cardErrors = fieldNames.map(field =>
      ({ message: state[field].error }));
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
    fieldNames.forEach((field) => {
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

  submitForm = () => {
    const { props } = this;
    this.payDirectDebit(props.onPaymentAuthorisation);
    props.submitForm();
  }

  validateForm = () => {
    const { props } = this;
    this.handleErrors();
    props.validateForm();
    return this.getCardErrorsLength(this.getCardErrors()) > 0;
  }

  render() {
    const { props, state } = this;
    const cardErrors = this.getCardErrors();
    const cardErrorsLength = this.getCardErrorsLength(cardErrors);
    const showGeneralError = props.allErrors.length === 0 && cardErrorsLength === 0 &&
      (props.cardError && props.cardError !== 'personal_details_incorrect');

    return (
      <span>
        {props.phase === 'entry' && (
          <Form
            {...props}
            showGeneralError={showGeneralError}
            cardErrors={cardErrors}
            cardErrorsLength={cardErrorsLength}
            accountHolderNameError={state.accountHolderName.error}
            accountNumberError={state.accountNumber.error}
            sortCodeError={state.sortCodeString.error}
            accountHolderConfirmationError={state.accountHolderConfirmation.error}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
        )}
        {props.phase === 'confirmation' && (
          <Playback
            {...props}
            onEditClick={props.editDirectDebitClicked}
            onConfirmClick={() => props.confirmDirectDebitClicked(props.onPaymentAuthorisation)}
          />
        )}
      </span>
    );
  }
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
