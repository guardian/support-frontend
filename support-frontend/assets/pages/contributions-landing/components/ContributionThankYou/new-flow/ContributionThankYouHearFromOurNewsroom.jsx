import React, { useState } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { Checkbox } from '@guardian/src-checkbox';
import { Button } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgNotification from './components/SvgNotification';
import styles from './styles';

const checkboxContainer = css`
  margin-top: ${space[2]}px;

  ${from.desktop} {
    margin-top: ${space[5]}px;
  }
`;

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const ContributionThankYouHearFromOurNewsroom = () => {
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);
  const actionIcon = <SvgNotification />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenInteractedWith ? 'You\'re signed up' : 'Hear from our newsroom'
      }
    />
  );
  const actionBody = (
    <ActionBody>
      {hasBeenInteractedWith ? (
        <p>
          Please check your inbox for a confirmation link. Soon after, you’ll
          receive your first email from the Guardian newsroom. You can
          unsubscribe at any time.
        </p>
      ) : (
        <>
          <p>
            <span css={styles.hideAfterDesktop}>
              Opt in to receive a regular newsletter from inside the Guardian.
            </span>
            <span css={styles.hideBeforeDesktop}>
              Our membership editor and others will discuss the most important
              recent news stories and suggest compelling articles to read. Opt
              in to receive their regular newsletter.
            </span>
          </p>
          <div css={checkboxContainer}>
            <div css={styles.hideAfterDesktop}>
              <Checkbox supporting="Get related news and offers - whether you are a contributor, subscriber, memember or would like to become one." />
            </div>
            <div css={styles.hideBeforeDesktop}>
              <Checkbox supporting="Contributions, subscriptions and membership: get related news and offers – whether you are a contributor, subscriber, member or would like to become one." />
            </div>
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
              Subscribe
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

export default ContributionThankYouHearFromOurNewsroom;
