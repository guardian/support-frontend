// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  isPopUpOpen: boolean,
  openDirectDebitPopUp: () => void,
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
  };

}

// ----- Component ----- //

const DirectDebitPopUpButton = (props: PropTypes) => {

  const button = (
    <button
      id="qa-pay-with-direct-debit"
      className="component-direct-debit-pop-up-button"
      onClick={props.openDirectDebitPopUp}
    >
    Pay with direct debit
    </button>);

  if (props.isPopUpOpen) {
    return (
      <div>
        {button}
        <DirectDebitPopUpForm callback={props.callback} />
      </div>);
  }
  return button;

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpButton);
