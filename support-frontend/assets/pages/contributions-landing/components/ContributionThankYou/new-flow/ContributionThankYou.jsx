import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { LinkButton } from '@guardian/src-button';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouContinueToAccount from './ContributionThankYouContinueToAccount';
import ContributionThankYouHearFromOurNewsroom from './ContributionThankYouHearFromOurNewsroom';
import ContributionThankYouSetSupportReminder from './ContributionThankYouSetSupportReminder';
import ContributionThankYouSendYourThoughts from './ContributionThankYouSendYourThoughts';
import ContributionThankYouShareYourSupport from './ContributionThankYouShareYourSupport';


const container = css`
  background: white;
  padding: 0 ${space[3]}px;

  ${from.desktop} {
    background: none;
    padding 0 ${space[24]}px;
  }
`;

const buttonContainer = css`
  padding-top: ${space[6]}px;
  padding-bottom: ${space[6]}px;
`;

const ContributionThankYou = () => (
  <div css={container}>
    <ContributionThankYouHeader />
    <ContributionThankYouContinueToAccount />
    <ContributionThankYouHearFromOurNewsroom />
    <ContributionThankYouSetSupportReminder />
    <ContributionThankYouSendYourThoughts />
    <ContributionThankYouShareYourSupport />
    <div css={buttonContainer} >
      <LinkButton priority="tertiary" >
            Return to the Guardian
      </LinkButton>
    </div>
  </div>
);


export default ContributionThankYou;
