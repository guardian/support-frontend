import React from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import { LinkButton } from '@guardian/src-button';
import { SvgFacebook, SvgTwitter, SvgEnvelope } from '@guardian/src-icons';

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

const buttonsContainer = css`
  margin-top: ${space[6]}px;

  & > * + * {
    margin-left: ${space[3]}px;
  }
`;

const SvgShare = () => (
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
      d="M27.0999 24.0666C29.2216 24.0666 30.8999 25.7766 30.8999 27.8666C30.8999 29.9882 29.2216 31.6666 27.0999 31.6666C25.0099 31.6666 23.3316 29.9882 23.3316 27.8666C23.3316 27.7082 23.3316 27.5182 23.3633 27.3916L12.0266 21.7233C11.2983 22.4199 10.4116 22.7683 9.3983 22.7683C7.24498 22.7683 5.56665 21.0899 5.56665 18.9999C5.56665 16.8783 7.24498 15.1683 9.3983 15.1683C10.38 15.1683 11.2983 15.6116 12.0266 16.2766L23.3633 10.6083C23.3316 10.4816 23.3316 10.3233 23.3316 10.1016C23.3316 8.01164 25.0099 6.33331 27.0999 6.33331C29.2216 6.33331 30.8999 8.01164 30.8999 10.1016C30.8999 12.2233 29.2216 13.9333 27.0999 13.9333C26.0866 13.9333 25.2316 13.5216 24.5033 12.8883L13.135 18.5249C13.1666 18.6199 13.1666 18.7783 13.1666 18.9999C13.1666 19.2216 13.1666 19.3799 13.135 19.4749L24.5033 25.1116C25.2316 24.4783 26.0866 24.0666 27.0999 24.0666ZM27.0999 7.85331C25.8649 7.85331 24.8199 8.83497 24.8199 10.1016C24.8199 11.3683 25.8649 12.4133 27.0999 12.4133C28.3666 12.4133 29.4116 11.3683 29.4116 10.1016C29.4116 8.83497 28.3666 7.85331 27.0999 7.85331ZM27.0999 30.1466C28.3666 30.1466 29.4116 29.1016 29.4116 27.8666C29.4116 26.5999 28.3666 25.5866 27.0999 25.5866C25.8649 25.5866 24.8199 26.5999 24.8199 27.8666C24.8199 29.1016 25.8649 30.1466 27.0999 30.1466Z"
      fill="#121212"
    />
  </svg>
);

const SvgLinkedIn = () => (
  <svg
    width="31"
    height="31"
    viewBox="0 0 31 31"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.78303 5.5C9.37125 5.52578 9.92684 5.77799 10.334 6.20406C10.7411 6.63013 10.9684 7.19717 10.9684 7.78697C10.9684 8.37677 10.7411 8.94381 10.334 9.36988C9.92684 9.79595 9.37125 10.0482 8.78303 10.0739C8.17753 10.0739 7.59683 9.83299 7.16868 9.4041C6.74053 8.97521 6.5 8.39351 6.5 7.78697C6.5 7.18043 6.74053 6.59873 7.16868 6.16984C7.59683 5.74095 8.17753 5.5 8.78303 5.5ZM6.81367 11.809H10.7524V24.5H6.81367V11.809ZM13.2225 11.809H16.9996V13.5441H17.0535C17.5789 12.5454 18.8642 11.4926 20.7797 11.4926C24.7635 11.4926 25.5 14.1215 25.5 17.5392V24.5H21.5671V18.3295C21.5671 16.8568 21.538 14.9643 19.5206 14.9643C17.4712 14.9643 17.1583 16.5681 17.1583 18.223V24.5H13.2225V11.809Z"
    />
  </svg>
);

const ContributionThankYouSendYourThoughts = () => (
  <section css={container}>
    <header css={header}>
      <SvgShare />
      <h2 css={headerText}>Share your support</h2>
    </header>
    <div css={bodyContainer}>
      <p>
        Invite your followers to support the Guardian’s open, independent
        reporting.
      </p>
      <div css={buttonsContainer}>
        <LinkButton
          priority="tertiary"
          size="default"
          icon={<SvgFacebook />}
          hideLabel
        />
        <LinkButton
          priority="tertiary"
          size="default"
          icon={<SvgTwitter />}
          hideLabel
        />
        <LinkButton
          priority="tertiary"
          size="default"
          icon={<SvgLinkedIn />}
          hideLabel
        />
        <LinkButton
          priority="tertiary"
          size="default"
          icon={<SvgEnvelope />}
          hideLabel
        />
      </div>
    </div>
  </section>
);

export default ContributionThankYouSendYourThoughts;
