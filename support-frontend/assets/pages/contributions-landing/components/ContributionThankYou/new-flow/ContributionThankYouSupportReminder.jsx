// @flow
// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { createReminderEndpoint } from 'helpers/routes';
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
import { OPHAN_COMPONENT_ID_SET_REMINDER } from '../utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
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

type ReminderDate = {
  date: Date,
  label: string
};

const getReminderDateWithDefaultLabel = (monthsUntilDate: number) => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + monthsUntilDate);

  const month = date.toLocaleDateString('default', { month: 'long' });
  const year =
    now.getFullYear() === date.getFullYear() ? '' : ` ${date.getFullYear()}`;
  const label = `in ${monthsUntilDate} months (${month}${year})`;

  return {
    date,
    label,
  };
};

const getDefaultReminderDates = (): ReminderDate[] => [
  getReminderDateWithDefaultLabel(3),
  getReminderDateWithDefaultLabel(6),
  getReminderDateWithDefaultLabel(9),
];

const GIVING_TUESDAY = {
  date: new Date(2020, 12, 1),
  label: 'on Giving Tuesday (1st of December)',
};
const GIVING_TUESDAY_REMINDER_CUT_OFF = new Date(2020, 11, 27);

const LAST_DAY_OF_THE_YEAR = {
  date: new Date(2020, 12, 31),
  label: 'on the last day of the year (31st of December)',
};
const LAST_DAY_OF_THE_YEAR_REMINDER_CUT_OFF = new Date(2020, 12, 28);

const getReminderDatesForUsEndOfYearAppeal = (): ReminderDate[] => {
  const now = new Date();
  if (now < GIVING_TUESDAY_REMINDER_CUT_OFF) {
    return [
      GIVING_TUESDAY,
      LAST_DAY_OF_THE_YEAR,
      getReminderDateWithDefaultLabel(12),
    ];
  } else if (now < LAST_DAY_OF_THE_YEAR_REMINDER_CUT_OFF) {
    return [
      LAST_DAY_OF_THE_YEAR,
      getReminderDateWithDefaultLabel(3),
      getReminderDateWithDefaultLabel(12),
    ];
  }
  return getDefaultReminderDates();
};

type ContributionThankYouSupportReminderProps = {|
  email: string,
  isUsEndOfYearAppeal: boolean
|};

const ContributionThankYouSupportReminder = ({
  email,
  isUsEndOfYearAppeal,
}: ContributionThankYouSupportReminderProps) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [hasBeenCompleted, setHasBeenInteractedWith] = useState(false);

  const reminderDates = isUsEndOfYearAppeal
    ? getReminderDatesForUsEndOfYearAppeal()
    : getDefaultReminderDates();

  const selectedDateAsApiString = () => {
    const selectedDate = reminderDates[selectedDateIndex].date;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const paddedMonth = month.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-01 00:00:00`;
  };

  const setReminder = () => {
    fetch(createReminderEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reminderDate: selectedDateAsApiString(),
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
              again. We’ll send you a single email, with no obligation.
            </span>
            <span css={styles.hideBeforeTablet}>
              Lots of readers chose to make single contributions at various
              points in the year. Opt in to receive a reminder in case you would
              like to support our journalism again. This will be a single email
              with no obligation.
            </span>
          </p>
          <form css={form}>
            <RadioGroup name="reminder" label="I'd like to be reminded in:">
              {reminderDates.map((date, index) => (
                <Radio
                  value={index}
                  label={date.label}
                  checked={selectedDateIndex === index}
                  onChange={() => setSelectedDateIndex(index)}
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
