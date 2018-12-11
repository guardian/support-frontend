// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import type { ContributionType } from 'helpers/contributions';

import TermsPrivacy from '../termsPrivacy/termsPrivacy';
import ContribLegal from '../contribLegal/contribLegal';


// ----- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
|};


// ----- Component ----- //

export default function LegalSection(props: PropTypes) {

  return (
    <div className="component-legal-section">
      <PageSection>
        <TermsPrivacy countryGroupId={props.countryGroupId} contributionType={props.contributionType} />
        <ContribLegal countryGroupId={props.countryGroupId} />
      </PageSection>
    </div>
  );

}
