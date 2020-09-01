import { css } from '@emotion/core';
import { titlepiece, body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';

const header = css`
  padding-top: ${space[4]}px;
  padding-bottom: ${space[5]}px;
`;

const headerTitleText = css`
  display: flex;
  flex-direction: column;
  ${titlepiece.small()};
  font-size: 24px;
`;

const headerSupportingText = css`
  ${body.small()};
`;

const ContributionThankYouHeader = () => (
  <header css={header}>
    <h1 css={headerTitleText}>
      <span>Thank you Anastasia</span>
      <span>for your valuable</span>
      <span>contribution <span role="img" aria-label="heart" >❤️</span></span>
    </h1>
    <p css={headerSupportingText}>
      To support us further, and enhance your experience with the Guardian, select the add-ons that suit you best.
    </p>
  </header>
);


export default ContributionThankYouHeader;
