// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import {
  openDirectDebitPopUp,
  type Action,
} from 'components/directDebit/directDebitActions';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import type { Status } from 'helpers/switch';
import type { RegularCheckoutCallback } from 'helpers/checkouts';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: RegularCheckoutCallback,
  isPopUpOpen: boolean,
  openDirectDebitPopUp: () => void,
  switchStatus: Status,
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
    status={props.switchStatus}
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
      Pay with Direct Debit
      <SvgArrowRightStraight />
    </button>
  );
}


// ----- Default Props ----- //

DirectDebitPopUpButton.defaultProps = {
  switchStatus: 'On',
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpButton);
