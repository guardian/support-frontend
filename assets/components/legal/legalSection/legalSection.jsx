// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import type { IsoCountry } from 'helpers/internationalisation/country';

import TermsPrivacy from '../termsPrivacy/termsPrivacy';
import ContribLegal from '../contribLegal/contribLegal';


// ----- Types ----- //

type PropTypes = {
  country: IsoCountry,
};


// ----- Component ----- //

export default function LegalSection(props: PropTypes) {

  return (
    <div className="component-legal-section">
      <PageSection>
        <TermsPrivacy country={props.country} />
        <ContribLegal />
      </PageSection>
    </div>
  );

}
