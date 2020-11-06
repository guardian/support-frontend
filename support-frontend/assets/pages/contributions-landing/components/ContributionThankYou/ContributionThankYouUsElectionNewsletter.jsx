// @flow
// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { Button } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgNotification from './components/SvgNotification';
import { OPHAN_COMPONENT_ID_US_ELECTION_NEWSLETTER } from './utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const signUpToNewsLetter = (email: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('listName', 'us-morning-newsletter');
  formData.append('name', '');

  fetch('https://www.theguardian.com/email', {
    method: 'POST',
    body: new URLSearchParams(formData),
  });
};

type ContributionThankYouUsElectionNewsletterProps = {|
  email: string
|};

const ContributionThankYouUsElectionNewsletter = ({
  email,
}: ContributionThankYouUsElectionNewsletterProps) => {
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

  const onSubmit = () => {
    trackComponentClick(OPHAN_COMPONENT_ID_US_ELECTION_NEWSLETTER);
    setHasBeenCompleted(true);
    signUpToNewsLetter(email);
  };

  const actionIcon = <SvgNotification />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenCompleted ? 'You\'re signed up' : 'First Thing: election special'
      }
    />
  );
  const actionBody = (
    <ActionBody>
      {hasBeenCompleted ? (
        <p>
          Please check your inbox for a confirmation link. Soon after, you’ll
          receive your first email from the Guardian newsroom. You can
          unsubscribe at any time.
        </p>
      ) : (
        <>
          <p>
            With First Thing, our morning newsletter, you get a global
            perspective on the US delivered to your inbox.
          </p>
          <div css={buttonContainer}>
            <Button
              onClick={onSubmit}
              priority="primary"
              size="default"
              icon={<SvgArrowRightStraight />}
              iconSide="right"
              nudgeIcon
            >
              Sign up to the newsletter
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

export default ContributionThankYouUsElectionNewsletter;
