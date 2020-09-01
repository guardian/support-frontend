import React from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import { Button } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';

const container = css`
  padding-top: ${space[2]}px;
  padding-bottom: ${space[5]}px;
  border-top: 1px solid ${neutral[86]};
  border-bottom: 1px solid ${neutral[86]};
`;

const header = css`
  display: flex;
  align-items: center;
`;

const headerText = css`
  display: flex;
  flex-direction: column;
  margin-left: ${space[1]}px;
  ${body.medium({ fontWeight: 'bold' })};
`;

const bodyContainer = css`
  * {
    ${body.small()};
  }
`;

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

const ContributionThankYouSendYourThoughts = () => (
  <section css={container}>
    <header css={header}>
      <SvgNotification />
      <h2 css={headerText}>Send us your thoughts</h2>
    </header>
    <div css={bodyContainer}>
      <p>
        Fill out this short form to tell us more about your experience of
        supporting us today.
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
    </div>
  </section>
);

export default ContributionThankYouSendYourThoughts;
