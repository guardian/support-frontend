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

const protestSurveyLink = 'https://www.surveymonkey.co.uk/r/RRPYWQJ';
const testimonialSurveyLink = 'https://www.surveymonkey.co.uk/r/SWLJ7JZ';
const globalTestimonialEndDate = Date.parse('2020-06-26');
const ausTestimonialEndDate = Date.parse('2020-07-10');

type PropTypes = {|
  isRunning: boolean,
  countryGroupId: CountryGroupId,
|};

function surveyUrl(countryGroupId): string {
  return (countryGroupId === 'AUDCountries' ? testimonialSurveyLink : protestSurveyLink);
}

function isBeforeEndDate(countryGroupId): boolean {
  const endDate = (countryGroupId === 'AUDCountries' ? ausTestimonialEndDate : globalTestimonialEndDate);
  const now = new Date();
  return now < endDate;
}

export default function ContributionsSurvey(props: PropTypes) {
  const showSurvey = props.isRunning && isBeforeEndDate(props.countryGroupId);

  return showSurvey ? (
    <div className="contribution-thank-you-block">
      <h3 className="contribution-thank-you-block__title">Tell us about your contribution</h3>
      <p className="contribution-thank-you-block__message">
          Please fill out this short form to help us learn a little more about your support for The Guardian
      </p>
      <AnchorButton
        href={surveyUrl(props.countryGroupId)}
        appearance="secondary"
        aria-label="Link to contribution survey"
      >
          Share your thoughts
      </AnchorButton>
    </div>
  ) : null;
}

