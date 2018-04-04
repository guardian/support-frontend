// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { closeDirectDebitPopUp, resetDirectDebitFormError } from 'components/directDebit/directDebitActions';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { SvgCross } from 'components/svg/svg';

import type { Phase } from 'components/directDebit/directDebitActions';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  isPopUpOpen: boolean,
  closeDirectDebitPopUp: () => void,
  phase: Phase,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.directDebit.isPopUpOpen,
    phase: state.page.directDebit.phase,
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

// ----- Utility ----- //

function pageTitle(phase: Phase) {
  if (phase === 'confirmation') {
    return (
      <span>
        <span className="component-direct-debit-pop-up-form__heading--title">
          Please confirm
        </span>
        <span className="component-direct-debit-pop-up-form__heading--title">
          your details
        </span>
      </span>
    );
  }
  return (
    <span>
      <span className="component-direct-debit-pop-up-form__heading--title">
        Please enter
      </span>
      <span className="component-direct-debit-pop-up-form__heading--title">
        your details below
      </span>
    </span>
  );
}

// ----- Component ----- //

const DirectDebitPopUpForm = (props: PropTypes) => {

  let content = null;

  if (props.isPopUpOpen) {
    content = (
      <div className="component-direct-debit-pop-up-form">
        <div className="component-direct-debit-pop-up-form__content">
          <h1 className="component-direct-debit-pop-up-form__heading">
            {pageTitle(props.phase)}
          </h1>
          <button
            id="qa-pay-with-direct-debit-close-pop-up"
            className="component-direct-debit-pop-up-form__close-button focus-target"
            onClick={props.closeDirectDebitPopUp}
          >
            <SvgCross />
          </button>
          <DirectDebitForm callback={props.callback} />
        </div>
      </div>
    );
  }

  return content;

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpForm);
