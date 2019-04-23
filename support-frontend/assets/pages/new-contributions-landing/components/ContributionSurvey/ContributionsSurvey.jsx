// @flow

// ----- Imports ----- //

import React from 'react';
import AnchorButton from 'components/button/anchorButton';

// ----- Component ----- //

export default function ContributionsSurvey(props) {
  const surveyLink = props.contributionType === 'ONE_OFF' ? 'https://google.com' : 'https://yahoo.com'

  return (
    <div className="component-contributions-survey">
        <h3 className="confirmation__title">Tell us about your contribution</h3>
        <p className="confirmation__message">
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
  );

}
