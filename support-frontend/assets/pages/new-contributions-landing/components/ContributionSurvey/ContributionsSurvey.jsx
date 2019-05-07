// @flow

// ----- Imports ----- //

import React from 'react';
import { type ContributionType } from 'helpers/contributions';
import AnchorButton from 'components/button/anchorButton';

// ----- Component ----- //

type PropTypes = {|
  contributionType: ContributionType,
|};

export default function ContributionsSurvey(props: PropTypes) {
  /* *******************************************************
   JTL: Survey links configurable below using payment type
   make sure to update before launching component again
   ****************************************************** */
  const surveyLink = props.contributionType === 'ONE_OFF' ? 'https://www.surveymonkey.com/r/SCPJHTW' : 'https://www.surveymonkey.com/r/RY2G6HM';

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
