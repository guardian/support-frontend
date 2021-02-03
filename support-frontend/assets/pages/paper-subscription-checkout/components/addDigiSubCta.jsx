// @flow

import React from 'react';
import { css } from '@emotion/core';
// import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import { Checkbox } from '@guardian/src-checkbox';
import GridImage from 'components/gridImage/gridImage';


type PropTypes = {|
  addDigitalSubscription: (event: SyntheticInputEvent<HTMLInputElement>) => void
|}

const ctaContainer = css`
  background-color: ${neutral[97]};
  padding: 0 ${space[6]}px;
`;

const imageContainer = css`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${neutral[86]};
`;

function AddDigiSubCta({ addDigitalSubscription }: PropTypes) {
  return (
    <section css={ctaContainer}>
      <div css={imageContainer}>
        <GridImage
          gridId="editionsShortPackshot"
          srcSizes={[500, 140]}
          sizes="(max-width: 480px) 200px,
            (max-width: 740px) 100%,
            500px"
          altText="Digital subscriptions"
          imgType="png"
        />
      </div>
      <Checkbox
        value="add-digital"
        label="Add the Digital subscription"
        onChange={addDigitalSubscription}
      />
    </section>
  );
}

export default AddDigiSubCta;
