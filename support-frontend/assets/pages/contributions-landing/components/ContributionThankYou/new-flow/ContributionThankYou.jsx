import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { GridRow, GridItem } from '@guardian/src-grid';
import { LinkButton } from '@guardian/src-button';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouContinueToAccount from './ContributionThankYouContinueToAccount';
import ContributionThankYouHearFromOurNewsroom from './ContributionThankYouHearFromOurNewsroom';
import ContributionThankYouSetSupportReminder from './ContributionThankYouSetSupportReminder';
import ContributionThankYouSendYourThoughts from './ContributionThankYouSendYourThoughts';
import ContributionThankYouShareYourSupport from './ContributionThankYouShareYourSupport';


const container = css`
  background: white;
`;

const buttonContainer = css`
  padding-top: ${space[6]}px;
  padding-bottom: ${space[6]}px;
`;

const ContributionThankYou = () => (
  <div css={container}>
    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <ContributionThankYouHeader />
      </GridItem>
    </GridRow>
    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <ContributionThankYouContinueToAccount />
      </GridItem>
    </GridRow>
    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <ContributionThankYouHearFromOurNewsroom />
      </GridItem>
    </GridRow>
    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <ContributionThankYouSetSupportReminder />
      </GridItem>
    </GridRow>
    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <ContributionThankYouSendYourThoughts />
      </GridItem>
    </GridRow>
    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <ContributionThankYouShareYourSupport />
      </GridItem>
    </GridRow>

    <GridRow breakpoints={['mobile', 'tablet']} >
      <GridItem spans={[4, 12]}>
        <div css={buttonContainer} >
          <LinkButton priority="tertiary" >
            Return to the Guardian
          </LinkButton>
        </div>
      </GridItem>
    </GridRow>
  </div>
);


export default ContributionThankYou;
