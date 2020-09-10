// @flow
// $FlowIgnore - required for hooks
import React, { useState, useEffect } from 'react';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { LinkButton } from '@guardian/src-button';
import { ButtonLink } from '@guardian/src-link';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import ExpandableContainer from './components/ExpandableContainer';
import BulletPointedList from './components/BulletPointedList';
import SvgPersonWithTick from './components/SvgPersonWithTick';
import styles from './styles';
import {
  OPHAN_COMPONENT_ID_SIGN_IN,
  OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN,
} from './utils/ophan';
import { routes } from 'helpers/routes';
import { trackComponentClick } from 'helpers/tracking/behaviour';

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

type ContributionThankYouContinueToAccountProps = {|
  email: string,
  csrf: Csrf
|};

const ContributionThankYouContinueToAccount = ({
  email,
  csrf,
}: ContributionThankYouContinueToAccountProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [signInUrl, setSignInUrl] = useState('https://theguardian.com');
  useEffect(() => {
    const payload = { email };
    fetch(routes.createSignInUrl, {
      method: 'post',
      headers: {
        'Csrf-Token': csrf.token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => setSignInUrl(data.signInLink));
  }, []);

  const actionIcon = <SvgPersonWithTick />;
  const actionHeader = <ActionHeader title="Continue to your account" />;

  const onSignInClick = () =>
    trackComponentClick(OPHAN_COMPONENT_ID_SIGN_IN);

  const onReadMoreClick = () => {
    trackComponentClick(OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN);
    setIsExpanded(true);
  };


  const expandableContent = (
    <div css={expandableContainer}>
      <p css={styles.hideAfterTablet}>
        Stay signed in across all your devices, to:
      </p>
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
        <span css={styles.hideAfterTablet}>
          We’ll show you fewer requests for support and improve your Guardian
          reading experience.{' '}
          {!isExpanded && (
            <ButtonLink
              css={bodyText}
              priority="secondary"
              onClick={onReadMoreClick}
            >
              Read more
            </ButtonLink>
          )}
        </span>
        <span css={styles.hideBeforeTablet}>
          By signing in, you enable us to recognise you as a supporter across
          our website and apps. This means we will:
        </span>
      </p>
      <div css={styles.hideAfterTablet}>
        <ExpandableContainer isExpanded={isExpanded} maxHeight={500}>
          {expandableContent}
        </ExpandableContainer>
      </div>
      <div css={styles.hideBeforeTablet}>{expandableContent}</div>
      <div css={buttonContainer}>
        <LinkButton
          onClick={onSignInClick}
          href={signInUrl}
          target="_blank"
          rel="noopener noreferrer"
          priority="primary"
          size="default"
          icon={<SvgArrowRightStraight />}
          iconSide="right"
          nudgeIcon
        >
          Continue
        </LinkButton>
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
