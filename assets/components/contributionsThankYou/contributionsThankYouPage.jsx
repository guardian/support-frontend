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
import type { CountryGroupId } from '../../helpers/internationalisation/countryGroup';

// ---- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  directDebit: ?DirectDebit,
  countryGroupId: CountryGroupId,
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
      {props.contributionType !== 'ONE_OFF' ? <RecurringContribBodyCopy {...props} /> : null}
      {props.marketingConsent}
      <QuestionsContact countryGroupId={props.countryGroupId} />
      <SpreadTheWord />
    </Page>
  );
}


// ----- Auxiliary Components ----- //

function RecurringContribBodyCopy(props: PropTypes) {
  // recurring
  if (props.directDebit) {
    return (
      <div className="component-direct-debit-details__container">
        <DirectDebitDetails {...props.directDebit} />
      </div>
    );
  }
  // recurring non-DD
  return <EmailConfirmation />;
}
