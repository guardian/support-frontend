// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Currency } from 'helpers/internationalisation/currency';
import { closeDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  callback: Function,
  currency: Currency,
  email: string,
  isTestUser: boolean,
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
    },
  };

}

// ----- Component ----- //

const DirectDebitPopUpForm = (props: PropTypes) => {

  let content = null;

  if (props.isPopUpOpen) {
    content = (
      <div>
        <button
          id="qa-pay-with-direct-debit-close-pop-up"
          className="component-direct-debit-pop-up-form"
          onClick={props.closeDirectDebitPopUp}
        >
          Close form
        </button>

        <DirectDebitForm />
      </div>
    );
  }

  return content;

};

// ----- Default Props ----- //

DirectDebitPopUpForm.defaultProps = {

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpForm);
