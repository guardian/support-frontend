// @flow
// $FlowIgnore - required for hooks
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { Checkbox, CheckboxGroup } from '@guardian/src-checkbox';
import { Button } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgNotification from './components/SvgNotification';
import styles from './styles';
import {
  OPHAN_COMPONENT_ID_MARKETING,
} from './utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';

const checkboxContainer = css`
  margin-top: ${space[2]}px;

  ${from.desktop} {
    margin-top: ${space[5]}px;
  }
`;

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const ERROR_MESSAGE = 'Please tick the box below, then click \'subscribe\'';

const mapStateToProps = () => ({
});


function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    subscribeToNewsLetter: (email: string, csrf: Csrf) => {
      sendMarketingPreferencesToIdentity(
        true,
        email,
        dispatch,
        csrf,
        'MARKETING_CONSENT',
      );
    },
  };
}

type ContributionThankYouHearFromOurNewsroomProps = {|
  email: string,
  csrf: Csrf,
  subscribeToNewsLetter: (email: string, csrf: Csrf) => void
|};

const ContributionThankYouHearFromOurNewsroom = ({
  email,
  csrf,
  subscribeToNewsLetter,
}: ContributionThankYouHearFromOurNewsroomProps) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

  // reset error message when consent changes
  useEffect(() => {
    setErrorMessage(null);
  }, [hasConsented]);

  const onSubmit = () => {
    if (!hasConsented) {
      setErrorMessage(ERROR_MESSAGE);
    } else {
      trackComponentClick(OPHAN_COMPONENT_ID_MARKETING);
      setHasBeenCompleted(true);
      subscribeToNewsLetter(email, csrf);
    }
  };

  const actionIcon = <SvgNotification />;
  const actionHeader = (
    <ActionHeader
      title={hasBeenCompleted ? 'You\'re signed up' : 'Hear from our newsroom'}
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
            <span css={styles.hideAfterTablet}>
              Opt in to receive a regular newsletter from inside the Guardian.
            </span>
            <span css={styles.hideBeforeTablet}>
              Our membership editor and others will discuss the most important
              recent news stories and suggest compelling articles to read. Opt
              in to receive their regular newsletter.
            </span>
          </p>
          <div css={checkboxContainer}>
            <CheckboxGroup error={errorMessage}>
              <div css={styles.hideAfterTablet}>
                <Checkbox
                  checked={hasConsented}
                  onChange={() => setHasConsented(!hasConsented)}
                  supporting="Get related news and offers - whether you are a contributor, subscriber, memember or would like to become one."
                />
              </div>
              <div css={styles.hideBeforeTablet}>
                <Checkbox
                  checked={hasConsented}
                  onChange={() => setHasConsented(!hasConsented)}
                  supporting="Contributions, subscriptions and membership: get related news and offers - whether you are a contributor, subscriber, member or would like to become one."
                />
              </div>
            </CheckboxGroup>
          </div>
          <div css={buttonContainer}>
            <Button
              onClick={onSubmit}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYouHearFromOurNewsroom);
