// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import TermsPrivacy from '../termsPrivacy/termsPrivacy';
import ContribLegal from '../contribLegal/contribLegal';


// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};


// ----- Component ----- //

export default function LegalSection(props: PropTypes) {

  return (
    <div className="component-legal-section">
      <PageSection>
        <TermsPrivacy countryGroupId={props.countryGroupId} />
        <ContribLegal countryGroupId={props.countryGroupId} />
      </PageSection>
    </div>
  );

}
