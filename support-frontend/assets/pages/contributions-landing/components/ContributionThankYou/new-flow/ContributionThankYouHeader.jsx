// @flow
import React from 'react';
import { css } from '@emotion/core';
import { titlepiece, body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';

const header = css`
  background: white;
  padding-top: ${space[4]}px;
  padding-bottom: ${space[5]}px;
  max-width: 600px;

  ${from.tablet} {
    background: none;
  }
`;

const headerTitleText = css`
  display: flex;
  flex-direction: column;
  ${titlepiece.small()};
  font-size: 24px;

  ${from.tablet} {
    font-size: 40px;
  }
`;

const headerTitleTextThreeLines = css`
  ${headerTitleText}
  display: flex;

  ${from.mobileMedium} {
    display: none;
  }
`;

const headerTitleTextTwoLines = css`
  ${headerTitleText}
  display: none;

  ${from.mobileMedium} {
    display: flex;
  }
`;

const headerSupportingText = css`
  ${body.small()};
  padding-top: ${space[1]}px;

  ${from.tablet} {
    font-size: 17px;
    padding-top: ${space[3]}px;
  }
`;

const directDebitSetupText = css`
  font-weight: bold;
`;

type ContributionThankYouHeaderProps = {|
  showDirectDebitMessage: boolean
|};

const ContributionThankYouHeader = ({
  showDirectDebitMessage,
}: ContributionThankYouHeaderProps) => (
  <header css={header}>
    <h1>
      <span css={headerTitleTextThreeLines}>
        <span>Thank you Anastasia</span>
        <span>for your valuable</span>
        <span>
          contribution{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </span>
      </span>
      <span css={headerTitleTextTwoLines}>
        <span>Thank you Anastasia for your</span>
        <span>
          valuable contribution{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </span>
      </span>
    </h1>
    <p css={headerSupportingText}>
      {showDirectDebitMessage && (
        <>
          <span css={directDebitSetupText}>
            Your Direct Debit has been set up.{' '}
          </span>
          Look out for an email within three business days confirming your
          recurring payment. This will appear as &apos;Guardian Media
          Group&apos; on your bank statements.
          <br />
          <br />
        </>
      )}
      To support us further, and enhance your experience with the Guardian,
      select the add-ons that suit you best.
    </p>
  </header>
);

export default ContributionThankYouHeader;
