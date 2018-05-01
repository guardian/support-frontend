// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionsThankYouPage from 'containerisableComponents/contributionsThankYou/contributionsThankYouPage';
import { openDirectDebitGuarantee, closeDirectDebitGuarantee } from 'components/directDebit/directDebitActions';

// ----- Map State/Props ----- //

function getDirectDebitDetails(state) {
  if (state.page.regularContrib.paymentMethod === 'DirectDebit') {
    return {
      isDirectDebit: true,
      isDDGuaranteeOpen: state.page.directDebit.isDDGuaranteeOpen,
      accountNumber: state.page.directDebit.accountNumber,
      accountHolderName: state.page.directDebit.accountHolderName,
      sortCodeArray: state.page.directDebit.sortCodeArray,
    };
  }
  return null;
}

function mapStateToProps(state) {
  const { contributionType } = state.page.regularContrib;
  const directDebitFields = getDirectDebitDetails(state);

  return {
    contributionType,
    ...directDebitFields,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openDDGuaranteeClicked: () => {
      dispatch(openDirectDebitGuarantee());
    },
    closeDDGuaranteeClicked: () => {
      dispatch(closeDirectDebitGuarantee());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsThankYouPage);
