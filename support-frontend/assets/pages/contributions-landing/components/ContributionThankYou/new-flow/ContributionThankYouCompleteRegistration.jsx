import React, { useState } from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { Button } from '@guardian/src-button';
import { ButtonLink } from '@guardian/src-link';
import { TextInput } from '@guardian/src-text-input';
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
`;

const form = css`
  margin-top: ${space[5]}px;

  & > * + * {
    margin-top: ${space[5]}px;
  }
`;

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const ContributionThankYouContinueToAccount = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);
  const actionIcon = <SvgPersonWithTick />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenInteractedWith ? 'You’re almost there!' : 'Complete Registration'
      }
    />
  );

  const expandableContent = (
    <div css={expandableContainer}>
      <BulletPointedList
        items={[
          'Remove unnecessary messages asking you for financial support',
          'Let you easily manage your recurring contributions, subscriptions and newsletters in one place',
        ]}
      />
    </div>
  );
  const actionBody = (
    <ActionBody>
      {hasBeenInteractedWith ? (
        <p>
          Please check your inbox to validate your email address – it takes just
          30 seconds. Make sure you sign in on each of the devices you use to
          read our journalism, either today or next time you use them.
        </p>
      ) : (
        <>
          <p>
            <span css={styles.hideAfterDesktop}>
              If you register, we can start recognising you as a supporter and
              remove unnecessary messages asking for financial support.{' '}
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
              Your free Guardian account is almost complete, you just need to
              set a password.
              <br />
              By registering, you enable us to recognise you as a supporter
              across our website and apps. This means we will:
            </span>
          </p>
          <div css={styles.hideAfterDesktop}>
            <ExpandableContainer isExpanded={isExpanded} maxHeight={500}>
              {expandableContent}
            </ExpandableContainer>
          </div>
          <div css={styles.hideBeforeDesktop}>{expandableContent}</div>
          <div>
            <form css={form}>
              <div>
                <TextInput
                  label="Email address"
                  supporting="example@domain.com"
                />
              </div>
              <div>
                <TextInput
                  label="Set a password"
                  supporting="Between 6 and 72 characters"
                />
              </div>
            </form>
          </div>
          <div css={buttonContainer}>
            <Button
              onClick={() => setHasBeenInteractedWith(true)}
              priority="primary"
              size="default"
              icon={<SvgArrowRightStraight />}
              iconSide="right"
              nudgeIcon
            >
              Register
            </Button>
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

export default ContributionThankYouContinueToAccount;
