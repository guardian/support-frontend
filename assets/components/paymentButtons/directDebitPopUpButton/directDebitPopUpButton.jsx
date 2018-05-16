// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import Switchable, { type Switch } from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import {
  openDirectDebitPopUp,
  type Action,
} from 'components/directDebit/directDebitActions';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: Function,
  isPopUpOpen: boolean,
  openDirectDebitPopUp: () => void,
  switch: Switch,
};
/* eslint-enable react/no-unused-prop-types */


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

const DirectDebitPopUpButton = (props: PropTypes) => (
  <Switchable
    switch={props.switch}
    component={() => <ButtonAndForm {...props} />}
    fallback={() => <PaymentError paymentMethod="direct debit" />}
  />
);


// ----- Auxiliary Components ----- //

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

/* eslint-disable react/default-props-match-prop-types */
DirectDebitPopUpButton.defaultProps = {
  switch: 'On',
};
/* eslint-enable react/default-props-match-prop-types */


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpButton);
