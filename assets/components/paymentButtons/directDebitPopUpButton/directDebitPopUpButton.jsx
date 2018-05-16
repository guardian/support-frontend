// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { openDirectDebitPopUp, type Action } from 'components/directDebit/directDebitActions';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';


// ---- Types ----- //

type Switch = 'Hide' | 'HideWithError' | 'Show';

/* eslint-disable react/no-unused-prop-types, react/require-default-props */
type PropTypes = {
  callback: Function,
  isPopUpOpen: boolean,
  openDirectDebitPopUp: () => void,
  switch?: Switch,
};
/* eslint-enable react/no-unused-prop-types, react/require-default-props */


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.directDebit.isPopUpOpen,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    openDirectDebitPopUp: () => {
      dispatch(openDirectDebitPopUp());
    },
  };

}


// ----- Component ----- //

const DirectDebitPopUpButton = (props: PropTypes) => {

  if (props.switch === 'Hide') {
    return null;
  } else if (props.switch === 'HideWithError') {
    return <ErrorMessage />;
  }

  return <ButtonAndForm {...props} />;

};


// ----- Auxiliary Components ----- //

function ErrorMessage() {
  return (
    <div className="component-direct-debit-pop-up-button">
      <p className="component-direct-debit-pop-up-butto__error-message">
        We are currently experiencing issues with direct debit payments.
        Please use another payment method or try again later.
      </p>
    </div>
  );
}

function ButtonAndForm(props: PropTypes) {

  if (props.isPopUpOpen) {
    return (
      <div>
        <Button openPopUp={props.openDirectDebitPopUp} />
        <DirectDebitPopUpForm callback={props.callback} />
      </div>
    );
  }

  return <Button openPopUp={props.openDirectDebitPopUp} />;

}

function Button(props: { openPopUp: () => void }) {
  return (
    <button
      id="qa-pay-with-direct-debit"
      className="component-direct-debit-pop-up-button"
      onClick={props.openPopUp}
    >
      Pay with direct debit
    </button>
  );
}


// ----- Default Props ----- //

DirectDebitPopUpButton.defaultProps = {
  switch: 'Show',
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpButton);
