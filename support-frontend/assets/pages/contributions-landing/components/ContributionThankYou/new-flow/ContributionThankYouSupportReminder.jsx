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
import {
  OPHAN_COMPONENT_ID_SET_REMINDER,
} from '../utils/ophan';
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

type ContributionThankYouSupportReminderProps = {|
  email: string,
  isEnvironmentMoment: boolean,
|};

const ContributionThankYouSupportReminder = ({
  email,
  isEnvironmentMoment,
}: ContributionThankYouSupportReminderProps) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [hasBeenCompleted, setHasBeenInteractedWith] = useState(false);

  const now = new Date();
  const reminderDates = isEnvironmentMoment ? [
    new Date(now.getFullYear(), now.getMonth() + 3),
    new Date(now.getFullYear(), now.getMonth() + 6),
    new Date(now.getFullYear(), now.getMonth() + 12),
  ] : [
    new Date(now.getFullYear(), now.getMonth() + 3),
    new Date(now.getFullYear(), now.getMonth() + 6),
    new Date(now.getFullYear(), now.getMonth() + 9),
  ];

  const formattedDate = (index: number): string => {
    if (isEnvironmentMoment && index === 2) {
      return 'In one year (our next environment pledge update)';
    }
    const date = reminderDates[index];

    const monthsUntilDate = ['three', 'six', 'nine'][index];
    const month = date.toLocaleDateString('default', { month: 'long' });
    const year = now.getFullYear() === date.getFullYear() ? '' : ` ${date.getFullYear()}`;

    return `In ${monthsUntilDate} months (${month}${year})`;
  };

  const selectedDateAsApiString = () => {
    const selectedDate = reminderDates[selectedDateIndex];
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
                  label={formattedDate(index)}
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
