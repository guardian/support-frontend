import { css } from '@emotion/core';
import { GridRow, GridItem } from '@guardian/src-grid';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouContinueToAccount from './ContributionThankYouContinueToAccount';
import ContributionThankYouHearFromOurNewsroom from './ContributionThankYouHearFromOurNewsroom';

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
  </div>
);


export default ContributionThankYou;
