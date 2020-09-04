import React, { useState } from 'react';
import { css } from '@emotion/core';
import { body, textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import { Button } from '@guardian/src-button';
import { ButtonLink, Link } from '@guardian/src-link';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { RadioGroup, Radio } from '@guardian/src-radio';
import { TextInput } from '@guardian/src-text-input';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import ExpandableContainer from './components/ExpandableContainer';
import SvgClock from './components/SvgClock';
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

const privacyText = css`
  ${styles.hideBeforeDesktop}
  ${textSans.small()}

  color: ${neutral[20]};
  margin-top: ${space[3]}px;
`;

const privacyTextLink = css`
  ${textSans.small()}

  color: ${neutral[20]};
`;

const ContributionThankYouSetSupportReminder = () => {
  const now = new Date();
  const reminderDates = [
    new Date(now.getFullYear(), now.getMonth() + 3),
    new Date(now.getFullYear(), now.getMonth() + 6),
    new Date(now.getFullYear(), now.getMonth() + 9),
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);
  const actionIcon = <SvgClock />;
  const actionHeader = (
    <ActionHeader
      title={
        hasBeenInteractedWith
          ? 'Your support reminder is set'
          : 'Set a support reminder'
      }
    />
  );

  const expandableContent = (
    <p css={expandableContainer}>
      Lots of readers chose to make single contributions at various points in
      the year. Opt in to receive a reminder in case you would like to support
      our journalism again. This will be a single email with no obligation.
    </p>
  );
  const actionBody = (
    <ActionBody>
      {hasBeenInteractedWith ? (
        <p>
          We will be in touch at the time you selected, so look out for a
          message from the Guardian in your inbox.
        </p>
      ) : (
        <>
          <p>
            <span css={styles.hideAfterDesktop}>
              Opt in to receive a reminder in case you would like to support our
              journalism again.{' '}
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
              Lots of readers chose to make single contributions at various
              points in the year. Opt in to receive a reminder in case you would
              like to support our journalism again. This will be a single email
              with no obligation.
            </span>
          </p>
          <div css={styles.hideAfterDesktop}>
            <ExpandableContainer isExpanded={isExpanded} maxHeight={250}>
              {expandableContent}
            </ExpandableContainer>
          </div>
          <form css={form}>
            <RadioGroup name="reminder" label="I'd like to be reminded in:">
              {reminderDates.map((date, index) => (
                <Radio
                  value={index}
                  label={date.toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })}
                  defaultChecked={index === 0}
                />
              ))}
            </RadioGroup>
            <div>
              <TextInput
                label="Email address"
                supporting="example@domain.com"
              />
            </div>
          </form>
          <div css={buttonContainer}>
            <Button
              onClick={() => setHasBeenInteractedWith(true)}
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
            <Link css={privacyTextLink} href="/" priority="secondary">
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

export default ContributionThankYouSetSupportReminder;
