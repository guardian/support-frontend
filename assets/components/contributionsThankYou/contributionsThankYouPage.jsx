// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import QuestionsContact from 'components/questionsContact/questionsContact';
import { type Contrib } from 'helpers/contributions';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import EmailConfirmation from './emailConfirmation';
import DirectDebitDetails, { type PropTypes as DirectDebit } from './directDebitDetails';

// ---- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  directDebit: ?DirectDebit,
  marketingConsent: Node,
};


// ----- Component ----- //

export default function ContributionsThankYouPage(props: PropTypes) {
  return (
    <Page
      id="contributions-thank-you-page"
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <CirclesIntroduction
        headings={['Thank you', 'for a valuable', 'contribution']}
        modifierClasses={['compact']}
      />
      <div className="multiline-divider" />
      <BodyCopy {...props} />
      {props.marketingConsent}
      <QuestionsContact />
      <SpreadTheWord />
    </Page>
  );
}


// ----- Auxiliary Components ----- //

function BodyCopy(props: PropTypes) {
  if (props.contributionType === 'ONE_OFF') {
    return null;
  } else if (props.directDebit) {
    return (
      <DirectDebitDetails {...props.directDebit} />
    );
  }
  return <EmailConfirmation />;
}
