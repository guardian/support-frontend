// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import PageSection from 'components/pageSection/pageSection';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';
import { openDirectDebitGuarantee, closeDirectDebitGuarantee } from 'components/directDebit/directDebitActions';
import { type Contrib, isRegularContribution } from 'helpers/contributions';

import EmailConfirmation from '../../pages/regular-contributions/components/emailConfirmation';
import MarketingConsentContainer from '../../pages/regular-contributions/components/marketingConsentContainer';
import DirectDebitPaymentMethodDetails from '../../pages/regular-contributions/components/directDebitPaymentMethodDetails';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type DirectDebitFields = {
  isDirectDebit: boolean,
  isDDGuaranteeOpen: boolean,
  accountNumber: string,
  accountHolderName: string,
  sortCodeArray: string[],
  openDDGuaranteeClicked: () => void,
  closeDDGuaranteeClicked: () => void,
}
type PropTypes = {
  contributionType: Contrib,
  directDebitFields: ?DirectDebitFields,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function getDirectDebitDetails(state) {
  return {
    isDirectDebit: state.page.regularContrib.paymentMethod === 'DirectDebit',
    isDDGuaranteeOpen: state.page.directDebit.isDDGuaranteeOpen,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    sortCodeArray: state.page.directDebit.sortCodeArray,
  };
}

function mapStateToProps(state) {
  const contributionType = state.page.regularContrib ? state.page.regularContrib.contributionType : 'ONE_OFF';
  // eslint-disable-next-line max-len
  const directDebitFields = isRegularContribution(contributionType) ? getDirectDebitDetails(state) : null;

  return {
    contributionType,
    directDebitFields,
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

function DirectDebitDetails(props: DirectDebitFields) {
  return (
    <div className="direct-debit-details">
      <DirectDebitPaymentMethodDetails
        accountHolderName={props.accountHolderName}
        sortCodeArray={props.sortCodeArray}
        accountNumber={props.accountNumber}
      />
      <div className="component-direct-debit-guarantee_background">
        <PageSection>
          <DirectDebitGuarantee
            isDDGuaranteeOpen={props.isDDGuaranteeOpen}
            openDDGuaranteeClicked={props.openDDGuaranteeClicked}
            closeDDGuaranteeClicked={props.closeDDGuaranteeClicked}
          />
        </PageSection>
      </div>
    </div>
  );
}

function getBodyCopy(props: PropTypes) {
  if (props.contributionType === 'ONE_OFF') {
    return '';
  } else if (props.directDebitFields && props.directDebitFields.isDirectDebit) {
    return DirectDebitDetails(props.directDebitFields);
  }
  return <EmailConfirmation />;
}

function ContributionsThankYouPage(props: PropTypes) {
  return (
    <div id="contributions-thank-you-page" className="gu-content">
      <SimpleHeader />
      <CirclesIntroduction
        headings={['Thank you', 'for a valuable', 'contribution']}
      />
      <div className="multiline-divider" />
      {getBodyCopy(props)}
      <MarketingConsentContainer />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsThankYouPage);
