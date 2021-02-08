// @flow

import React from 'react';
import { css } from '@emotion/core';
// import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { headline } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { Checkbox } from '@guardian/src-checkbox';
import GridImage from 'components/gridImage/gridImage';
import { ListWithSubText } from 'components/list/list';


type PropTypes = {|
  digiSubPrice: string;
  addDigitalSubscription: (event: SyntheticInputEvent<HTMLInputElement>) => void
|}

const ctaContainer = css`
  background-color: ${neutral[97]};
  padding: 0 ${space[6]}px;
`;

const lightBorder = css`
  border-bottom: 1px solid ${neutral[86]};
`;

const imageContainer = css`
  display: flex;
  justify-content: center;
`;

const heading = css`
  ${headline.xsmall({ fontWeight: 'bold' })}
  margin-bottom: ${space[3]}px;
`;

const content = css`
  padding: ${space[6]}px 0;
`;

const list = css`
  margin-bottom: 0;
  ${from.desktop} {
    margin-bottom: 0;
  }
`;

const listCopy = [
  {
    content: 'The Guardian Editions app',
    subText: `Each edition available to read by 6am (GMT), 7 days a week for
    IOS and Android mobile and tablet. Download and read whenever it suits you.`,
  },
  {
    content: 'Premium access to The Guardian Live app',
    subText: 'Live feed, Discover and daily crosswords. Download the news whenever it suits you.',
  },
  {
    content: 'Ad-free',
    subText: 'Enjoy our journalism uninterrupted, without adverts',
  },
];

function AddDigiSubCta({ addDigitalSubscription, digiSubPrice }: PropTypes) {
  return (
    <section css={ctaContainer}>
      <div css={[imageContainer, lightBorder]}>
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
      <div css={[content, lightBorder]}>
        <h2 css={heading}>What&apos;s included</h2>
        <ListWithSubText cssOverrides={list} items={listCopy} bulletSize="small" bulletColour="dark" />
      </div>
      <div css={content}>
        <Checkbox
          value="add-digital"
          label={`Add the Digital subscription for ${digiSubPrice}`}
          onChange={addDigitalSubscription}
        />
      </div>
    </section>
  );
}

export default AddDigiSubCta;
