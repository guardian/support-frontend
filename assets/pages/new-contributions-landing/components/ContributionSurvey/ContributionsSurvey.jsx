// @flow

// ----- Imports ----- //

import React from 'react';

import { ButtonWithRightArrow } from '../ButtonWithRightArrow/ButtonWithRightArrow';

// ----- Component ----- //

export default function ContributionsSurvey() {

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
