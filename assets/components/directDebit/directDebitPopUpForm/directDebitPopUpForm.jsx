// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { closeDirectDebitPopUp, resetDirectDebitFormError } from 'components/directDebit/directDebitActions';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { SvgCross } from 'components/svg/svg';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  isPopUpOpen: boolean,
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
    closeDirectDebitPopUp: () => {
      dispatch(closeDirectDebitPopUp());
      dispatch(resetDirectDebitFormError());
    },
  };

}

// ----- Component ----- //

const DirectDebitPopUpForm = (props: PropTypes) => {

  let content = null;

  if (props.isPopUpOpen) {
    content = (
      <div className="component-direct-debit-pop-up-form">
        <div className="component-direct-debit-pop-up-form__content">
          <h1 className="component-direct-debit-pop-up-form__heading">Please enter your details below</h1>
          <button
            id="qa-pay-with-direct-debit-close-pop-up"
            className="component-direct-debit-pop-up-form__close-button"
            onClick={props.closeDirectDebitPopUp}
          >
            <span>
              <SvgCross />
            </span>
          </button>
          <DirectDebitForm callback={props.callback} />
        </div>
        <div className="component-direct-debit-pop-up-form__background" />
      </div>
    );
  }

  return content;

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpForm);
