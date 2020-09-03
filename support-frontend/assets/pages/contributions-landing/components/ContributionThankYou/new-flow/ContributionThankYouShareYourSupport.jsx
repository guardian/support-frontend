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

const buttonsContainer = css`
  margin-top: ${space[6]}px;

  & > * + * {
    margin-left: ${space[3]}px;
  }
`;

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
          priority="tertiary"
          size="default"
          icon={<SvgFacebook />}
          hideLabel
        />
        <LinkButton
          priority="tertiary"
          size="default"
          icon={<SvgTwitter />}
          hideLabel
        />
        <LinkButton
          priority="tertiary"
          size="default"
          icon={<SvgLinkedIn />}
          hideLabel
        />
        <LinkButton
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
