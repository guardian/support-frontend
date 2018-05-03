// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import PageSection from 'components/pageSection/pageSection';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';
import { type Contrib } from 'helpers/contributions';

import EmailConfirmation from './emailConfirmation';
import MarketingConsentContainer from './marketingConsentContainer';
import DirectDebitPaymentMethodDetails from './directDebitPaymentMethodDetails';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
  isDirectDebit: boolean,
  isDDGuaranteeOpen: boolean,
  accountNumber: string,
  accountHolderName: string,
  sortCodeArray: string[],
  openDDGuaranteeClicked: () => void,
  closeDDGuaranteeClicked: () => void,
};

function DirectDebitDetails(props: PropTypes) {
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

function BodyCopy(props: PropTypes) {
  if (props.contributionType === 'ONE_OFF') {
    return null;
  } else if (props.isDirectDebit) {
    return <DirectDebitDetails {...props} />;
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
      <BodyCopy {...props} />
      <MarketingConsentContainer />
      <QuestionsContact />
      <SpreadTheWord />
      <Footer />
    </div>
  );
}

// ----- Exports ----- //

export default ContributionsThankYouPage;
