// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from '../ctaLink/ctaLink';

// ----- Component ----- //

export default function ContributionsSurvey() {

  return (
    <div className="component-contributions-survey">
      <p>
          Please tell us about your contribution to The Guardian by filling out this short form.
      </p>
      <CtaLink
        text="Share your thoughts"
        url="https://www.surveymonkey.co.uk/r/WR7P2ZM"
        accessibilityHint="Please tell us about your contribution to The Guardian by filling out this short form."
        modifierClasses={['survey']}
      />
    </div>
  );

}
