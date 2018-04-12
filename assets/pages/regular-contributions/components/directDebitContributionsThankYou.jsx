// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from 'components/thankYouIntroduction/thankYouIntroduction';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';

import EmailConfirmation from './emailConfirmation';
import MarketingConsentContainer from './marketingConsentContainer';
import DirectDebitPaymentMethodDetails from './directDebitPaymentMethodDetails';

export default function DirectDebitContributionsThankYouPage(props: Object) {
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
      <MarketingConsentContainer />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  );
}
