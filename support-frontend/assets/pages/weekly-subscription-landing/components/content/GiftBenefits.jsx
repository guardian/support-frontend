// @flow

import React from 'react';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from, until } from '@guardian/src-foundations/mq';

import FlexContainer from 'components/containers/FlexContainer';
import { List } from 'components/productPage/productPageList/productPageList';
import GiftHeading from './GiftHeading';

const giftBenefits = css`
  border-top: 1px solid ${neutral[86]};
  border-bottom: 1px solid ${neutral[86]};
  ${from.tablet} {
    border: 1px solid ${neutral[86]};
  }
  `;

const giftBenefitsBlock = css`
  padding: ${space[3]}px;
`;

const giftBenefitsMobileBorder = css`
  ${until.tablet} {
    border-top: 1px solid ${neutral[86]};
  }
`;

function GiftBenefits() {
  return (
    <FlexContainer cssOverrides={giftBenefits}>
      <section id="gift-benefits-them" css={giftBenefitsBlock}>
        <GiftHeading text="What they'll get:" />
        <List items={[
        { explainer: 'The Guardian Weekly delivered, wherever they are in the world' },
        { explainer: 'The Guardian\'s global journalism to keep them informed' },
        { explainer: 'The very best of The Guardian\'s puzzles' },
      ]}
        />
      </section>
      <section id="gift-benefits-you" css={[giftBenefitsBlock, giftBenefitsMobileBorder]}>
        <GiftHeading text="What you'll get:" />
        <List items={[
        { explainer: 'Your gift supports The Guardian\'s independent journalism' },
        { explainer: 'Access to the magazine\'s digital archive' },
        { explainer: '35% off the cover price' },
      ]}
        />
      </section>
    </FlexContainer>
  );
}

export default GiftBenefits;
