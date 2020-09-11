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
import {
  OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
  OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
  OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN,
  OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
} from './utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';

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

const ContributionThankYouSocialShare = () => {
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
          onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgFacebook />}
          hideLabel
        />
        <LinkButton
          href={getTwitterShareLink(LANDING_PAGE_URL, TWITTER_TEXT_COPY)}
          onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_TWITTER)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgTwitter />}
          hideLabel
        />
        <LinkButton
          href={getLinkedInShareLink(LANDING_PAGE_URL)}
          onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgLinkedIn />}
          hideLabel
        />
        <LinkButton
          href={getEmailShareLink(EMAIL_SUBJECT_COPY, EMAIL_BODY_COPY)}
          onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_EMAIL)}
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

export default ContributionThankYouSocialShare;
