// @flow

// ----- Imports ----- //

import React from 'react';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { ButtonWithRightArrow } from './ButtonWithRightArrow';

type PropTypes = {|
  countryGroupId: CountryGroupId,
|};

// ----- Component ----- //

export default function ContributionsSurvey(props: PropTypes) {

  if (props.countryGroupId === 'UnitedStates') {
    return (
      <div className="component-contributions-survey">
        <span>
          <h3>What should the Guardian US cover in 2019?</h3>
          <span>
            We want your input. Vote now and share your story ideas with our newsroom.
            We&#39;ll pick our favorite submissions from readers and pursue some of your ideas in the coming year.
          </span>
        </span>
        <ButtonWithRightArrow
          componentClassName="component-contributions-survey__button"
          buttonClassName="button--survey"
          accessibilityHintId="Please tell us about your contribution to The Guardian by filling out this short form."
          type="button"
          buttonCopy="Share your ideas"
          onClick={
            () => {
              window.location.assign('https://guardiannewsampampmedia.formstack.com/forms/us_end_of_year_postcontribution');
            }
          }
        />
      </div>
    );
  }
  return (
    <div className="component-contributions-survey">
      <h3>
        Please tell us about your contribution to The Guardian by filling out this short form.
      </h3>
      <ButtonWithRightArrow
        componentClassName="component-contributions-survey__button"
        buttonClassName="button--survey"
        accessibilityHintId="Please tell us about your contribution to The Guardian by filling out this short form."
        type="button"
        buttonCopy="Share your thoughts"
        onClick={
          () => {
            window.location.assign('https://www.surveymonkey.co.uk/r/QVKCKXQ');
          }
        }
      />
    </div>
  );

}
