// @flow
// $FlowIgnore - required for hooks
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import type { Csrf } from 'helpers/csrf/csrfReducer';
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
import { checkEmail } from 'helpers/forms/formValidation';
import {
  setPasswordError as setPasswordErrorAction,
  updatePassword as updatePasswordAction,
  type Action,
} from '../../contributionsLandingActions';
import { setPasswordGuest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import styles from './styles';
import {
  OPHAN_COMPONENT_ID_SIGN_UP,
  OPHAN_COMPONENT_ID_READ_MORE_SIGN_UP,
} from './utils/ophan';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';

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

const mapStateToProps = state => ({
  password: state.page.form.setPasswordData.password,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  passwordError: state.page.form.setPasswordData.passwordError,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    updatePassword: (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        dispatch(updatePasswordAction(event.target.value));
      }
    },
    setPasswordError: (passwordError: boolean) => {
      dispatch(setPasswordErrorAction(passwordError));
    },
  };
}

const checkPassword = (password: string) =>
  password.length >= 6 && password.length <= 72;

const PASSWORD_ERROR_MESSAGE =
  'Please enter a password between 6 and 72 characters long';

type ContributionThankYouSignUpProps = {|
  csrf: Csrf,
  email: string,
  password: string,
  guestAccountCreationToken: string,
  updatePassword: Event => void,
  passwordError: boolean,
  setPasswordError: boolean => void
|};

const ContributionThankYouSignUp = ({
  csrf,
  email,
  password,
  guestAccountCreationToken,
  updatePassword,
  setPasswordError,
  passwordError,
}: ContributionThankYouSignUpProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenCompleted, setHasBeenInteractedWith] = useState(false);

  useEffect(() => {
    trackComponentLoad(OPHAN_COMPONENT_ID_SIGN_UP);
  }, []);

  const onReadMoreClick = () => {
    trackComponentClick(OPHAN_COMPONENT_ID_READ_MORE_SIGN_UP);
    setIsExpanded(true);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const emailIsValid = checkEmail(email);

    const passwordIsValid = checkPassword(password);
    setPasswordError(!passwordIsValid);

    if (passwordIsValid && emailIsValid) {
      setPasswordGuest(password, guestAccountCreationToken, csrf).then((response) => {
        if (response === true) {
          trackComponentClick(OPHAN_COMPONENT_ID_SIGN_UP);
          setHasBeenInteractedWith(true);
        } else {
          setPasswordError(true);
        }
      });
    }
  };

  const actionIcon = <SvgPersonWithTick />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenCompleted ? 'You\u2019re almost there!' : 'Complete registration'
      }
    />
  );

  const actionBody = (
    <ActionBody>
      {hasBeenCompleted ? (
        <p>
          Please check your inbox to validate your email address – it takes just
          30 seconds. Make sure you sign in on each of the devices you use to
          read our journalism, either today or next time you use them.
        </p>
      ) : (
        <>
          <p>
            <span css={styles.hideAfterTablet}>
              If you register, we can start recognising you as a supporter and
              remove unnecessary messages asking for financial support.{' '}
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
              Your free Guardian account is almost complete, you just need to
              set a password. By registering, you enable us to recognise you as
              a supporter across our website and apps. This means we will:
            </span>
          </p>
          <div css={styles.hideAfterTablet}>
            <ExpandableContainer isExpanded={isExpanded} maxHeight={300}>
              <div css={expandableContainer}>
                <p>
                  You will be able to easily manage your recurring
                  contributions, subscriptions and newsletters in one place.
                </p>
              </div>
            </ExpandableContainer>
          </div>
          <div css={styles.hideBeforeTablet}>
            <div css={expandableContainer}>
              <BulletPointedList
                items={[
                  'Remove unnecessary messages asking you for financial support',
                  'Let you easily manage your recurring contributions, subscriptions and newsletters in one place',
                ]}
              />
            </div>
          </div>
          <div>
            <form onSubmit={onSubmit} css={form} noValidate>
              <div>
                <TextInput
                  value={email}
                  label="Email address"
                  supporting="example@domain.com"
                  disabled
                />
              </div>
              <div>
                <TextInput
                  label="Set a password"
                  supporting="Between 6 and 72 characters"
                  value={password}
                  onChange={updatePassword}
                  error={passwordError ? PASSWORD_ERROR_MESSAGE : ''}
                  required
                  type="password"
                />
              </div>
              <div css={buttonContainer}>
                <Button
                  type="submit"
                  priority="primary"
                  size="default"
                  icon={<SvgArrowRightStraight />}
                  iconSide="right"
                  nudgeIcon
                >
                  Register
                </Button>
              </div>
            </form>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContributionThankYouSignUp);
