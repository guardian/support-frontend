// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';

// ----- Component ----- //

export default function ContributionsSurvey() {

  return (
    <div className="component-contributions-survey">
      <h3>
        Please tell us about your contribution to The Guardian by filling out this short form.
      </h3>
      <CtaLink
        text="Share your thoughts"
        url="https://www.surveymonkey.co.uk/r/QVKCKXQ"
        accessibilityHint="Please tell us about your contribution to The Guardian by filling out this short form."
        modifierClasses={['survey']}
      />
    </div>
  );

}
