// @flow

// ----- Imports ----- //

import React from 'react';
import CentredContainer from 'components/containers/centredContainer';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';
import HeroRoundel from 'components/page/heroRoundel';
import { promotionHTML, type PromotionCopy } from 'helpers/productPrice/promotions';
import { getTimeboundQuery, getTimeboundCopy } from 'helpers/timeBoundedCopy/timeBoundedCopy';
import { HeroPriceCards } from './heroPriceCards';
import DefaultRoundel from './defaultRoundel';
import {
  heroCopy,
  heroTitle,
  paragraphs,
  yellowHeading,
  circleTextGeneric,
  roundelOverrides,
  embeddedRoundel,
} from './heroStyles';

type PropTypes = {
  promotionCopy: PromotionCopy,
  priceList: any[],
}

const HeroCopy = () => (
  <>
    <p>
      <strong>With two innovative apps and ad-free reading,</strong> a digital subscription gives
      you the richest experience of Guardian journalism. It also sustains the independent reporting you love.
    </p>
    <p>
      Plus, for a limited time, you can read our latest special edition - The books of&nbsp;2021.
    </p>
  </>
);


function HeroWithPriceCards({
  promotionCopy, priceList,
}: PropTypes) {
  const title = promotionCopy.title || <>Subscribe for stories<br />
    <span css={yellowHeading}>that must be told</span></>;

  const promoCopy = promotionHTML(promotionCopy.description, { tag: 'div' });
  const roundelText = promotionHTML(promotionCopy.roundel, { css: circleTextGeneric }) || <DefaultRoundel />;
  const defaultCopy = getTimeboundCopy('digitalSubscription', getTimeboundQuery() || new Date()) || <HeroCopy />;
  const copy = promoCopy || defaultCopy;

  return (
    <PageTitle
      title="Digital subscription"
      theme="digital"
    >
      <CentredContainer>
        <Hero
          image={
            <HeroPriceCards
              priceList={priceList}
              roundel={
                <HeroRoundel cssOverrides={embeddedRoundel} theme="digital">
                  {roundelText}
                </HeroRoundel>}
            />
          }
          roundelElement={
            <HeroRoundel
              cssOverrides={roundelOverrides}
              theme="digital"
            >
              {roundelText}
            </HeroRoundel>
          }
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>{title}</h2>
            <div css={paragraphs}>
              {copy}
            </div>
          </section>
        </Hero>
      </CentredContainer>
    </PageTitle>
  );
}

export { HeroWithPriceCards };
