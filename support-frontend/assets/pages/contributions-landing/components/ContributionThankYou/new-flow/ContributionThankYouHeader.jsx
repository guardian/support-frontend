import { css } from '@emotion/core';
import { titlepiece, body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';

const header = css`
  padding-top: ${space[4]}px;
  padding-bottom: ${space[5]}px;
`;

const headerTitleText = css`
  display: flex;
  flex-direction: column;
  ${titlepiece.small()};
  font-size: 24px;

  ${from.desktop} {
    font-size: 40px;
  }
`;

const headerTitleTextThreeLines = css`
  ${headerTitleText}
  display: flex;

  ${from.desktop} {
    display: none;
  }
`;

const headerTitleTextTwoLines = css`
  ${headerTitleText}
  display: none;

  ${from.desktop} {
    display: flex;
  }
`;

const headerSupportingText = css`
  ${body.small()};

  ${from.desktop} {
    font-size: 17px;
    padding-top: ${space[2]}px;
  }
`;

const headerSupportingTextOneLine = css`
  ${headerSupportingText}

  ${from.desktop} {
    display: none;
  }
`;

const headerSupportingTextTwoLines = css`
  ${headerSupportingText}
  display: none;

  ${from.desktop} {
    display: flex;
    flex-direction: column;
  }
`;

const ContributionThankYouHeader = () => (
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
    <p>
      <span css={headerSupportingTextOneLine}>
        To support us further, and enhance your experience with the Guardian,
        select the add-ons that suit you best.
      </span>
      <span css={headerSupportingTextTwoLines}>
        <span>To support us further, and enhance your experience with the</span>
        <span>Guardian, select the add-ons that suit you best.</span>
      </span>
    </p>
  </header>
);

export default ContributionThankYouHeader;
