import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { LinkButton } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgSpeechBubbleWithPlus from './components/SvgSpeechBubbleWithPlus';
import styles from './styles';
import { OPHAN_COMPONENT_ID_SURVEY } from './utils/ophan';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const SURVEY_LINK = 'https://www.surveymonkey.co.uk/r/KY7XRR2';

const ContributionThankYouSurvey = () => {
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

  useEffect(() => {
    trackComponentLoad(OPHAN_COMPONENT_ID_SURVEY);
  }, []);

  const actionIcon = <SvgSpeechBubbleWithPlus />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenCompleted
          ? 'Thank you for sharing your thoughts'
          : 'Send us your thoughts'
      }
    />
  );

  const onClick = () => {
    trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
    setHasBeenCompleted(true);
  };

  const actionBody = (
    <ActionBody>
      {hasBeenCompleted ? (
        <p>
          You’re helping us deepen our understanding of Guardian supporters.
        </p>
      ) : (
        <>
          <p>
            <span css={styles.hideAfterTablet}>
              Fill out this short form to tell us more about your experience of
              supporting us today – it only takes a minute.
            </span>
            <span css={styles.hideBeforeTablet}>
              We would love to hear more about your experience of supporting the
              Guardian today. Please fill out this short form – it only takes a
              minute.
            </span>
          </p>
          <div css={buttonContainer}>
            <LinkButton
              onClick={onClick}
              href={SURVEY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              priority="primary"
              size="default"
              icon={<SvgArrowRightStraight />}
              iconSide="right"
              nudgeIcon
            >
              Provide feedback
            </LinkButton>
          </div>
        </>
      )}
    </ActionBody>
  );

  return (
    <ActionContainer
      icon={actionIcon}
      header={actionHeader}
      body={actionBody}
    />
  );
};

export default ContributionThankYouSurvey;
