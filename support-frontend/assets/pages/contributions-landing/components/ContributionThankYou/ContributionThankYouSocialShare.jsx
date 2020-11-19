// @flow
import React from 'react';
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
import { generateReferralCode } from '../../../../helpers/campaignReferralCodes';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';

const buttonsContainer = css`
  margin-top: ${space[6]}px;

  & > * + * {
    margin-left: ${space[3]}px;
  }
`;

type PropTypes = { email: string, createReferralCodes: boolean, campaignCode: ?string, isUsEndOfYearAppeal: boolean }

const ContributionThankYouSocialShare = (props: PropTypes) => {
  const referralCode = props.createReferralCodes && props.campaignCode ?
    generateReferralCode(props.email, props.campaignCode) :
    null;

  const header = props.isUsEndOfYearAppeal
    ? 'Share your year-end support'
    : 'Share your support';

  const body = props.isUsEndOfYearAppeal
    ? 'As 2020 ends and a new year begins, we need your help to reach more people. Every supporter that joins helps to sustain the Guardian’s open, independent journalism for the long term. Please invite your friends, family and followers to support us today.'
    : 'Invite your followers to support the Guardian’s open, independent reporting.';

  const actionIcon = <SvgShare />;
  const actionHeader = <ActionHeader title={header} />;
  const actionBody = (
    <ActionBody>
      <p>{body}</p>
      <div css={buttonsContainer}>
        <LinkButton
          href={getFacebookShareLink(referralCode)}
          onClick={() =>
            trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK)
          }
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgFacebook />}
          hideLabel
        />
        <LinkButton
          href={getTwitterShareLink(referralCode, props.isUsEndOfYearAppeal)}
          onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_TWITTER)}
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgTwitter />}
          hideLabel
        />
        <LinkButton
          href={getLinkedInShareLink(referralCode)}
          onClick={() =>
            trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN)
          }
          target="_blank"
          rel="noopener noreferrer"
          priority="tertiary"
          size="default"
          icon={<SvgLinkedIn />}
          hideLabel
        />
        <LinkButton
          href={getEmailShareLink(referralCode, props.isUsEndOfYearAppeal)}
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
