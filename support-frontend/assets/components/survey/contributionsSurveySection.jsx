// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import ContributionsSurvey from './contributionsSurvey';


// ----- Component ----- //

export default function ContributionsSurveySection() {

  return (
    <div className="component-contributions-survey-section">
      <PageSection modifierClass="component-contributions-survey-section">
        <ContributionsSurvey />
      </PageSection>
    </div>
  );

}
