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
import styles from './styles';

const bodyText = css`
  ${body.small()};
`;

const expandableContainer = css`
  overflow: hidden;

  transition: max-height 0.1s ease-in-out;

  & > * + * {
    margin-top: ${space[4]}px;
  }
`;

const expandableContainerCollapsed = css`
  ${expandableContainer}
  max-height: 0px;
`;

const expandableContainerExpanded = css`
  ${expandableContainer}
  padding-top: ${space[4]}px;
  max-height: 500px;
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


const SvgClock = () => (
  <svg
    width="39"
    height="38"
    viewBox="0 0 39 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.4332 18.9999C33.4332 26.6949 27.1949 32.9332 19.4999 32.9332C11.805 32.9332 5.56665 26.6949 5.56665 18.9999C5.56665 11.305 11.805 5.06665 19.4999 5.06665C27.1949 5.06665 33.4332 11.305 33.4332 18.9999ZM21.0199 18.5566L20.1016 7.59998H18.8666L17.9166 19.4749L19.5316 21.0899L28.3666 20.2666V18.9999L21.0199 18.5566Z"
      fill="#121212"
    />
  </svg>
);

const ContributionThankYouSetSupportReminder = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const actionIcon = <SvgClock />;
  const actionHeader = <ActionHeader title="Set a support reminder" />;
  const actionBody = (
    <ActionBody>
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
          Lots of readers chose to make single contributions at various points
          in the year. Opt in to receive a reminder in case you would like to
          support our journalism again. This will be a single email with no
          obligation.
        </span>
      </p>
      <div css={styles.hideAfterDesktop}>
        <div
          css={
            isExpanded
              ? expandableContainerExpanded
              : expandableContainerCollapsed
          }
        >
          <p>
            Lots of readers chose to make single contributions at various points
            in the year. Opt in to receive a reminder in case you would like to
            support our journalism again. This will be a single email with no
            obligation.
          </p>
        </div>
      </div>
      <form css={form}>
        <RadioGroup
          name="reminder"
          label="I'd like to be reminded in:"
          supporting="This is just a test"
        >
          <Radio value="march" label="March 2020" defaultChecked />
          <Radio value="june" label="June 2020" />
          <Radio value="december" label="December 2020" />
        </RadioGroup>
        <div>
          <TextInput label="Email address" supporting="example@domain.com" />
        </div>
      </form>
      <div css={buttonContainer}>
        <Button
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
        visit our <Link css={privacyTextLink} href="/" priority="secondary">Privacy Policy</Link>.
      </p>
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
