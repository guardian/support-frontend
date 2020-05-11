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

const testimonialSurveyLink = 'https://www.surveymonkey.co.uk/r/SWLJ7JZ';
const globalTestimonialEndDate = Date.parse('2020-05-13');
const ausTestimonialEndDate = Date.parse('2020-05-28');

type PropTypes = {|
  isRunning: boolean,
  countryGroupId: CountryGroupId,
|};

export default function ContributionsSurvey(props: PropTypes) {
  const isAus = props.countryGroupId === 'AUDCountries';
  const endDate = isAus ? ausTestimonialEndDate : globalTestimonialEndDate;
  const now = new Date();
  const showSurvey = props.isRunning && now < endDate;

  return showSurvey ? (
    <div className="contribution-thank-you-block">
      <h3 className="contribution-thank-you-block__title">Tell us about your contribution</h3>
      <p className="contribution-thank-you-block__message">
          Please fill out this short form to help us learn a little more about your support for The Guardian
      </p>
      <AnchorButton
        href={testimonialSurveyLink}
        appearance="secondary"
        aria-label="Link to contribution survey"
      >
          Share your thoughts
      </AnchorButton>
    </div>
  ) : null;
}

