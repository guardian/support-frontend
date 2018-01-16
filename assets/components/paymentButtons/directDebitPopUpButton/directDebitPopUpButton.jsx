// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Currency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage';
import { openDirectDebitPopUp, closeDirectDebitPopUp } from './directDebitActions';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  callback: Function,
  currency: Currency,
  email: string,
  isTestUser: boolean,
  isPopUpOpen: boolean,
  openDirectDebitPopUp: () => void,
  closeDirectDebitPopUp: () => void,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.directDebit.isPopUpOpen,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    openDirectDebitPopUp: () => {
      dispatch(openDirectDebitPopUp());
    },
    closeDirectDebitPopUp: () => {
      dispatch(closeDirectDebitPopUp());
    },
  };

}

// ----- Component ----- //

const DirectDebitPopUpButton = (props: PropTypes) => {

  const onClick = () => {
    storage.setSession('paymentMethod', 'DirectDebit');
    props.openDirectDebitPopUp();
  };

  let content = null;

  if (props.isPopUpOpen) {
    content = null;
  } else {
    content = (
      <button
        id="qa-pay-with-direct-debit"
        className="component-direct-debit-pop-up-button"
        onClick={onClick}
      >
        Pay with direct debit
      </button>);
  }

  return ({ content });

};

// ----- Default Props ----- //

DirectDebitPopUpButton.defaultProps = {

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpButton);
