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

export default function DefaultContributionsThankYouPage() {
  return (
    <div className="gu-content">
      <SimpleHeader />
      <ThankYouIntroduction
        highlights={['Thank you']}
        headings={['for a valuable', 'contribution']}
      />
      <div className="multiline-divider" />
      <EmailConfirmation />
      <MarketingConsentContainer />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  );
}
