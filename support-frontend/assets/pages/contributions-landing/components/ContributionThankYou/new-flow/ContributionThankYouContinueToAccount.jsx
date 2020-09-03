import React, { useState } from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { Button } from '@guardian/src-button';
import { ButtonLink } from '@guardian/src-link';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import ExpandableContainer from './components/ExpandableContainer';
import BulletPointedList from './components/BulletPointedList';
import SvgPersonWithTick from './components/SvgPersonWithTick';
import styles from './styles';

const bodyText = css`
  ${body.small()};
`;

const expandableContainer = css`
  margin-top: ${space[4]}px;

  & > * + * {
    margin-top: ${space[4]}px;
  }
`;

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const ContributionThankYouContinueToAccount = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const actionIcon = <SvgPersonWithTick />;
  const actionHeader = <ActionHeader title="Continue to your account" />;

  const expandableContent = (
    <div css={expandableContainer}>
      <p css={styles.hideAfterDesktop}>Stay signed in across all your devices, to:</p>
      <BulletPointedList
        items={[
          'Remove unnecessary messages asking you for financial support',
          'Let you easily manage your recurring contributions, subscriptions and newsletters in one place',
        ]}
      />
      <p>
        Make sure you sign in on each of the devices you use to read our
        journalism – either today or next time you use them.
      </p>
    </div>
  );
  const actionBody = (
    <ActionBody>
      <p>
        <span css={styles.hideAfterDesktop}>
          We’ll show you fewer requests for support and improve your Guardian
          reading experience.{' '}
          {!isExpanded && (
            <ButtonLink
              css={bodyText}
              priority="secondary"
              onClick={() => setIsExpanded(true)}
            >
              Read more
            </ButtonLink>
          )}
        </span>
        <span css={styles.hideBeforeDesktop}>
          By signing in, you enable us to recognise you as a supporter across
          our website and apps. This means we will:
        </span>
      </p>
      <div css={styles.hideAfterDesktop}>
        <ExpandableContainer isExpanded={isExpanded} maxHeight={500}>
          {expandableContent}
        </ExpandableContainer>
      </div>
      <div css={styles.hideBeforeDesktop}>
        {expandableContent}
      </div>
      <div css={buttonContainer}>
        <Button
          priority="primary"
          size="default"
          icon={<SvgArrowRightStraight />}
          iconSide="right"
          nudgeIcon
        >
          Continue
        </Button>
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

export default ContributionThankYouContinueToAccount;
