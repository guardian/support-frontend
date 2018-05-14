// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import ContributionsThankYouPage from 'containerisableComponents/contributionsThankYou/contributionsThankYouPage';
import { openDirectDebitGuarantee, closeDirectDebitGuarantee, type Action } from 'components/directDebit/directDebitActions';


// ----- Map State/Props ----- //

function getDirectDebitDetails(state) {
  if (state.page.regularContrib.paymentMethod === 'DirectDebit') {
    return {
      isDDGuaranteeOpen: state.page.directDebit.isDDGuaranteeOpen,
      accountNumber: state.page.directDebit.accountNumber,
      accountHolderName: state.page.directDebit.accountHolderName,
      sortCodeArray: state.page.directDebit.sortCodeArray,
    };
  }
  return null;
}

function mapStateToProps(state) {
  return {
    contributionType: state.page.regularContrib,
    directDebit: getDirectDebitDetails(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    openDDGuaranteeClicked: () => {
      dispatch(openDirectDebitGuarantee());
    },
    closeDDGuaranteeClicked: () => {
      dispatch(closeDirectDebitGuarantee());
    },
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {

  const directDebit = stateProps.directDebit ?
    { ...stateProps.directDebit, ...dispatchProps } :
    null;

  return {
    ...ownProps,
    contributionType: stateProps.contributionType,
    directDebit,
  };

}


// ----- Export ----- //

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ContributionsThankYouPage);
