// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';

import ContributionSelection from './contributionSelectionNewDesign';


// ----- Component ----- //

export default function Contribute() {

  return (
    <div className="contribute-new-design">
      <InfoSection heading="contribute" className="contribute-new-design__content gu-content-margin">
        <ContributionSelection currency={{ iso: 'GBP', glyph: '£' }} contributionType="MONTHLY" />
      </InfoSection>
    </div>
  );

}
