// @flow
// $FlowIgnore - required for hooks
import React, { useState, useEffect } from 'react';
import { createOneOffReminderEndpoint } from 'helpers/routes';
import { logException } from 'helpers/logger';
import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import { Button } from '@guardian/src-button';
import { Link } from '@guardian/src-link';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { RadioGroup, Radio } from '@guardian/src-radio';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgClock from './components/SvgClock';
import styles from './styles';
import { OPHAN_COMPONENT_ID_SET_REMINDER } from './utils/ophan';
import {
  trackComponentClick,
  trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { privacyLink } from 'helpers/legal';

const form = css`
  margin-top: ${space[5]}px;

  & > * + * {
    margin-top: ${space[5]}px;
  }
`;

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const privacyText = css`
  ${styles.hideBeforeTablet}
  ${textSans.small()}
  font-family: GuardianTextSans,Guardian Text Sans Web,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif !important;
  font-size: 15px !important;

  color: ${neutral[20]};
  margin-top: ${space[3]}px;
`;

const privacyTextLink = css`
  ${textSans.small()}

  color: ${neutral[20]};
`;

interface ReminderSignup {
  reminderPeriod: string;
  reminderOption: string;
}

interface ReminderChoice {
  signup: ReminderSignup;
  label: string;
}

const REMINDER_PLATFORM = 'WEB';
const REMINDER_STAGE = 'POST';
const REMINDER_COMPONENT = 'THANKYOU';

const getReminderPeriod = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // javascript dates run from 0-11, we want 1-12
  const paddedMonth = month.toString().padStart(2, '0');

  return `${year}-${paddedMonth}-01`;
};

const getReminderOption = monthsUntilDate => `${monthsUntilDate}-months`;

const getDefaultLabel = (date: Date, monthsUntilDate: number, now: Date) => {
  const month = date.toLocaleDateString('default', { month: 'long' });
  const year =
    now.getFullYear() === date.getFullYear() ? '' : ` ${date.getFullYear()}`;

  return `in ${monthsUntilDate} months (${month}${year})`;
};

const getReminderChoiceWithDefaultLabel = (monthsUntilDate: number): ReminderChoice => {
  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth() + monthsUntilDate,
  );

  return {
    label: getDefaultLabel(date, monthsUntilDate, now),
    signup: {
      reminderPeriod: getReminderPeriod(date),
      reminderOption: getReminderOption(monthsUntilDate),
    },
  };
};

const getDefaultReminderChoices = (): ReminderChoice[] => [
  getReminderChoiceWithDefaultLabel(3),
  getReminderChoiceWithDefaultLabel(6),
  getReminderChoiceWithDefaultLabel(9),
];

type ContributionThankYouSupportReminderProps = {|
  email: string
|};

const ContributionThankYouSupportReminder = ({
  email,
}: ContributionThankYouSupportReminderProps) => {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0);
  const [hasBeenCompleted, setHasBeenInteractedWith] = useState(false);

  useEffect(() => {
    trackComponentLoad(OPHAN_COMPONENT_ID_SET_REMINDER);
  }, []);

  const reminderChoices = getDefaultReminderChoices();

  const setReminder = () => {
    fetch(createOneOffReminderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        reminderPlatform: REMINDER_PLATFORM,
        reminderComponent: REMINDER_COMPONENT,
        reminderStage: REMINDER_STAGE,
        ...reminderChoices[selectedChoiceIndex].signup,
      }),
    }).then((response) => {
      if (!response.ok) {
        logException('Reminder sign up failed at the point of request');
      }
    });
  };

  const onSubmit = () => {
    setReminder();
    trackComponentClick(OPHAN_COMPONENT_ID_SET_REMINDER);
    setHasBeenInteractedWith(true);
  };

  const actionIcon = <SvgClock />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenCompleted
          ? 'Your support reminder is set'
          : 'Set a support reminder'
      }
    />
  );

  const actionBody = (
    <ActionBody>
      {hasBeenCompleted ? (
        <p>
          We will be in touch at the time you selected, so look out for a
          message from the Guardian in your inbox.
        </p>
      ) : (
        <>
          <p>
            <span css={styles.hideAfterTablet}>
              Choose a time when we can invite you to support our journalism
              again. We’ll send you a maximum of two reminder emails, with no
              obligation.
            </span>
            <span css={styles.hideBeforeTablet}>
              Many readers choose to support Guardian journalism by making
              single contributions at various points in the year. Opt in to
              whichever time suits you best, and we’ll send you a maximum of two
              reminder emails, with no obligation.
            </span>
          </p>
          <form css={form}>
            <RadioGroup name="reminder" label="I'd like to be reminded in:">
              {reminderChoices.map((choice, index) => (
                <Radio
                  value={index}
                  label={choice.label}
                  checked={selectedChoiceIndex === index}
                  onChange={() => setSelectedChoiceIndex(index)}
                />
              ))}
            </RadioGroup>
          </form>
          <div css={buttonContainer}>
            <Button
              onClick={onSubmit}
              priority="primary"
              size="default"
              icon={<SvgArrowRightStraight />}
              iconSide="right"
              nudgeIcon
            >
              Set my reminder
            </Button>
          </div>
          <p css={privacyText}>
            To find out what personal data we collect and how we use it, please
            visit our{' '}
            <Link
              css={privacyTextLink}
              href={privacyLink}
              target="_blank"
              rel="noopener noreferrer"
              priority="secondary"
            >
              Privacy Policy
            </Link>
            .
          </p>
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

export default ContributionThankYouSupportReminder;
