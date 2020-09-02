import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { Button } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import styles from './styles';

const buttonContainer = css`
  margin-top: ${space[6]}px;
`;

const SvgNotification = () => (
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
      d="M27.4166 16.4666V12.35H23.2999V10.45H27.4166V6.33331H29.3166V10.45H33.4332V12.35H29.3166V16.4666H27.4166ZM20.7666 11.4C20.7666 15.5799 24.1866 18.9999 28.3666 18.9999V23.4333L26.4666 25.3332H15.6999L11.8683 31.6666H10.6333V25.3332H7.43498L5.56665 23.4333V12.0333L7.46664 10.1333H20.8616C20.7983 10.545 20.7666 10.9883 20.7666 11.4Z"
      fill="#121212"
    />
  </svg>
);

const ContributionThankYouSendYourThoughts = () => {
  const actionIcon = <SvgNotification />;
  const actionHeader = <ActionHeader title="Send us your thoughts" />;
  const actionBody = (
    <ActionBody>
      <p>
        <span css={styles.hideAfterDesktop}>
          Fill out this short form to tell us more about your experience of
          supporting us today.
        </span>
        <span css={styles.hideBeforeDesktop}>
          We would love to hear more about your experience of supporting the
          Guardian today. Please fill out this short form – it only takes a
          minute.
        </span>
      </p>
      <div css={buttonContainer}>
        <Button
          priority="primary"
          size="default"
          icon={<SvgArrowRightStraight />}
          iconSide="right"
          nudgeIcon
        >
          Provide feedback
        </Button>
      </div>
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

export default ContributionThankYouSendYourThoughts;
