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

import EmailConfirmation from './emailConfirmation';
import MarketingConsentContainer from './marketingConsentContainer';
import DirectDebitPaymentMethodDetails from './directDebitPaymentMethodDetails';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  isDirectDebit: boolean,
  isDDGuaranteeOpen: boolean,
  accountNumber: string,
  accountHolderName: string,
  sortCodeArray: string[],
  openDDGuaranteeClicked: () => void,
  closeDDGuaranteeClicked: () => void,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isDirectDebit: state.page.regularContrib.paymentMethod === 'DirectDebit',
    isDDGuaranteeOpen: state.page.directDebit.isDDGuaranteeOpen,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    sortCodeArray: state.page.directDebit.sortCodeArray,
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

function RegularContributionsThankYouPage(props: PropTypes) {
  const bodyCopy = props.isDirectDebit ? (
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
  ) : (
    <EmailConfirmation />
  );

  return (
    <div id="regular-contributions-thank-you-page">
      <SimpleHeader />
      <CirclesIntroduction
        headings={['Thank you', 'for a valuable', 'contribution']}
      />
      <div className="multiline-divider" />
      {bodyCopy}
      <MarketingConsentContainer />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(RegularContributionsThankYouPage);
