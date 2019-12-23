// @flow

// ----- Imports ----- //

import React from 'react';
import AnchorButton from 'components/button/anchorButton';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Component ----- //

/* **********************************************************
In order to display this component, a surveyLink must be
configured below and the prop 'isRunning' needs to be set to
`true` where the component is rendered (currently on the
`ContributionThankYou` and `ContributionThankYouPasswordSet`)
*********************************************************** */


type PropTypes = {|
  isRunning: boolean,
  countryGroupId: CountryGroupId,
|};

export default function ContributionsSurvey(props: PropTypes) {
  const surveyLink = 'https://www.surveymonkey.co.uk/r/RLGSQ87';
  const isEurope = pprops.countryGroupId === 'EURCountries';
  const showSurvey = props.isRunning && isEurope && surveyLink;

  return showSurvey ? (
    <div className="contribution-thank-you-block">
      <h3 className="contribution-thank-you-block__title">Tell us about your contribution</h3>
      <p className="contribution-thank-you-block__message">
          Please fill out this short form to help us learn a little more about your support for The Guardian
      </p>
      <AnchorButton
        href={surveyLink}
        appearance="secondary"
        aria-label="Link to contribution survey"
      >
          Share your thoughts
      </AnchorButton>
    </div>
  ) : null;
}

