// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from 'components/thankYouIntroduction/thankYouIntroduction';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';

import EmailConfirmation from './emailConfirmation';
import MarketingConsentContainer from './marketingConsentContainer';
import DirectDebitPaymentMethodDetails from './directDebitPaymentMethodDetails';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  isDDGuaranteeOpen: boolean,
  accountNumber: string,
  accountHolderName: string,
  sortCodeArray: string[],
  openDDGuaranteeClicked: () => void,
  closeDDGuaranteeClicked: () => void,
};
/* eslint-enable react/no-unused-prop-types */

function DirectDebitContributionsThankYouPage(props: PropTypes) {
  return (
    <div className="gu-content">
      <SimpleHeader />
      <ThankYouIntroduction
        highlights={['Thank you']}
        headings={['for a valuable', 'contribution']}
      />
      <div className="multiline-divider" />
      <EmailConfirmation />
      <DirectDebitPaymentMethodDetails
        accountHolderName={props.accountHolderName}
        sortCodeArray={props.sortCodeArray}
        accountNumber={props.accountNumber}
      />
      <DirectDebitGuarantee
        isDDGuaranteeOpen={props.isDDGuaranteeOpen}
        openDDGuaranteeClicked={props.openDDGuaranteeClicked}
        closeDDGuaranteeClicked={props.closeDDGuaranteeClicked}
      />
      <MarketingConsentContainer />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  );
}

export default DirectDebitContributionsThankYouPage;
