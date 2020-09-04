import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { LinkButton } from '@guardian/src-button';
import { SvgFacebook, SvgTwitter, SvgEnvelope } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgShare from './components/SvgShare';
import SvgLinkedIn from './components/SvgLinkedIn';
import {
  getFacebookShareLink,
  getTwitterShareLink,
  getLinkedInShareLink,
  getEmailShareLink,
} from './utils/social';

const buttonsContainer = css`
  margin-top: ${space[6]}px;

  & > * + * {
    margin-left: ${space[3]}px;
  }
`;

const LANDING_PAGE_URL = 'https://support.theguardian.com/contribute';
const TWITTER_TEXT_COPY =
  'Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard The Guardian’s future – so more people, across the world, can keep accessing factual information for free';
const EMAIL_SUBJECT_COPY = 'Join me in supporting open, independent journalism';
const EMAIL_BODY_COPY =
  'Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard The Guardian’s future – so more people, across the world, can keep accessing factual information for free: https://support.theguardian.com/contribute';

const ContributionThankYouSendYourThoughts = () => {
  const actionIcon = <SvgShare />;
  const actionHeader = <ActionHeader title="Share your support" />;
  const actionBody = (
    <ActionBody>
      <p>
        Invite your followers to support the Guardian’s open, independent
        reporting.
      </p>
      <div css={buttonsContainer}>
        <LinkButton
          href={getFacebookShareLink(LANDING_PAGE_URL)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgFacebook />}
          hideLabel
        />
        <LinkButton
          href={getTwitterShareLink(LANDING_PAGE_URL, TWITTER_TEXT_COPY)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgTwitter />}
          hideLabel
        />
        <LinkButton
          href={getLinkedInShareLink(LANDING_PAGE_URL)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgLinkedIn />}
          hideLabel
        />
        <LinkButton
          href={getEmailShareLink(EMAIL_SUBJECT_COPY, EMAIL_BODY_COPY)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgEnvelope />}
          hideLabel
        />
      </div>
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

export default ContributionThankYouSendYourThoughts;
