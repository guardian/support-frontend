import { css } from '@emotion/core';
import { GridRow, GridItem } from '@guardian/src-grid';
import ContributionThankYouHeader from './ContributionThankYouHeader';

const container = css`
  background: white;
`;

const ContributionThankYou = () => (
  <div css={container}>
    <GridRow breakpoints={['mobile']} >
      <GridItem spans={[4]}>
        <ContributionThankYouHeader />
      </GridItem>
    </GridRow>
  </div>
);


export default ContributionThankYou;
