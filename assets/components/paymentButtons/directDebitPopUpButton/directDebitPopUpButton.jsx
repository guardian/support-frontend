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
import type { Status } from 'helpers/settings';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  callback: PaymentAuthorisation => void,
  isPopUpOpen: boolean,
  openDirectDebitPopUp: () => void,
  switchStatus: Status,
  whenUnableToOpen: () => void,
  canOpen: () => boolean,
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
        <Button
          openPopUp={props.openDirectDebitPopUp}
          canOpen={props.canOpen}
          whenUnableToOpen={props.whenUnableToOpen}
        />
        <DirectDebitPopUpForm callback={props.callback} />
      </div>
    );
  }

  return (<Button
    openPopUp={props.openDirectDebitPopUp}
    canOpen={props.canOpen}
    whenUnableToOpen={props.whenUnableToOpen}
  />);

}

function Button(props: {
  openPopUp: () => void,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  }) {

  const onClick = () => {
    if (props.canOpen()) {
      props.openPopUp();
    } else {
      props.whenUnableToOpen();
    }
  };

  return (
    <button
      id="qa-pay-with-direct-debit"
      className="component-direct-debit-pop-up-button"
      onClick={onClick}
    >
      Pay with Direct Debit
      <SvgArrowRightStraight />
    </button>
  );
}


// ----- Default Props ----- //

DirectDebitPopUpButton.defaultProps = {
  switchStatus: 'On',
  canOpen: () => true,
  whenUnableToOpen: () => undefined,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitPopUpButton);
