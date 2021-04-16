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
import { Button, buttonReaderRevenue } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { ThemeProvider } from 'emotion-theming';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgNotification from './components/SvgNotification';
import styles from './styles';
import {
  OPHAN_COMPONENT_ID_MARKETING,
} from './utils/ophan';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';

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


const CONTROL_COPY = 'Get related news and offers - whether you are a contributor, subscriber, member or would like to become one.';
const V1_COPY = 'Stay up-to-date with our latest offers and the aims of the organisation, as well as the ways to enjoy and support our journalism.';
const V2_COPY = 'Stay up-to-date with ways to enjoy and support our journalism, the aims of the organisation and our latest offers.';

const mapStateToProps = state => ({
  thankyouPageMarketingConsentTestVariant:
    state.common.abParticipations.thankyouPageMarketingConsentTestR3,
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

type ContributionThankYouMarketingConsentProps = {|
  email: string,
  csrf: Csrf,
  subscribeToNewsLetter: (email: string, csrf: Csrf) => void,
  thankyouPageHeadingTestVariant: boolean,
  thankyouPageMarketingConsentTestVariant: string,
|};

const ContributionThankYouMarketingConsent = ({
  email,
  csrf,
  subscribeToNewsLetter,
  thankyouPageHeadingTestVariant,
  thankyouPageMarketingConsentTestVariant,
}: ContributionThankYouMarketingConsentProps) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

  useEffect(() => {
    trackComponentLoad(OPHAN_COMPONENT_ID_MARKETING);
  }, []);

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

  const getCheckboxCopy = () => {
    if (thankyouPageMarketingConsentTestVariant === 'v1') {
      return V1_COPY;
    } else if (thankyouPageMarketingConsentTestVariant === 'v2') {
      return V2_COPY;
    }
    return CONTROL_COPY;
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
              <Checkbox
                checked={hasConsented}
                onChange={() => setHasConsented(!hasConsented)}
                supporting={getCheckboxCopy()}
              />
            </CheckboxGroup>
          </div>
          <div css={buttonContainer}>
            {
              thankyouPageHeadingTestVariant ?
                <ThemeProvider theme={buttonReaderRevenue}>
                  <Button
                    onClick={onSubmit}
                    size="default"
                    icon={<SvgArrowRightStraight />}
                    iconSide="right"
                    nudgeIcon
                    css={css`color: black;`}
                  >
                    Subscribe
                  </Button>
                </ThemeProvider> :
                <Button
                  onClick={onSubmit}
                  priority={thankyouPageHeadingTestVariant ? 'secondary' : 'primary'}
                  size="default"
                  icon={<SvgArrowRightStraight />}
                  iconSide="right"
                  nudgeIcon
                >
                  Subscribe
                </Button>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYouMarketingConsent);
