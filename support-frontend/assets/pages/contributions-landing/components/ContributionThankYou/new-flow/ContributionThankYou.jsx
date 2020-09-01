import { css } from '@emotion/core';
import { GridRow, GridItem } from '@guardian/src-grid';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouContinueToAccount from './ContributionThankYouContinueToAccount';
import ContributionThankYouHearFromOurNewsroom from './ContributionThankYouHearFromOurNewsroom';
import ContributionThankYouSetSupportReminder from './ContributionThankYouSetSupportReminder';

const container = css`
  background: white;
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
  </div>
);


export default ContributionThankYou;
