// @flow

// ----- Imports ----- //

import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';
import { brandAlt } from '@guardian/src-foundations/palette';

import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';

import { type ProductPrices } from 'helpers/productPrice/productPrices';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperProductPrices';

import { getDiscountCopy } from './discountCopy';


type PropTypes = {|
  productPrices: ProductPrices
|}

const heroCopy = css`
  padding: 0 ${space[3]}px ${space[3]}px;
  ${from.desktop} {
    max-width: 80%;
  }
`;

const heroTitle = css`
  ${headline.medium({ fontWeight: 'bold' })};
  margin-bottom: ${space[3]}px;

  ${from.tablet} {
    ${headline.large({ fontWeight: 'bold' })};
  }
`;

const heroTitleHighlight = css`
  color: ${brandAlt[400]};
`;

const heroParagraph = css`
  ${body.medium({ lineHeight: 'loose' })}
  margin-bottom: ${space[9]}px;
`;

const roundelCentreLine = css`
  ${headline.xsmall({ fontWeight: 'bold' })}
  ${from.tablet} {
    ${headline.medium({ fontWeight: 'bold' })}
  }
`;


function PaperHero({ productPrices }: PropTypes) {
  const maxSavingVsRetail = productPrices ? getMaxSavingVsRetail(productPrices) : 0;
  const { roundel } = getDiscountCopy(maxSavingVsRetail);
  const roundelText = (
    <>
      {/* role="text" is non-standardised but works in Safari. Ensures the whole section is read as one text element */}
      {/* eslint-disable-next-line jsx-a11y/aria-role */}
      <div role="text">
        {roundel.map((text, index) => {
          if (index === 1) {
            return <div css={roundelCentreLine}>{text}</div>;
          }
          return text;
        })}
      </div>
    </>
  );

  return (
    <PageTitle
      title="Paper subscription"
      theme="weekly"
    >
      <CentredContainer>
        <Hero
          image={<GridImage
            gridId="printCampaignHero"
            srcSizes={[714, 500, 140]}
            sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            1000px"
            imgType="png"
            altText="Newspapers"
          />}
          roundelText={roundelText}
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>
              The other side to the story<br />
              <span css={heroTitleHighlight}>is your subscription</span>
            </h2>
            <p css={heroParagraph}>
              With two innovative apps and ad-free reading, a digital subscription gives you the richest experience
              of Guardian journalism. It also sustains the independent reporting you love.
            </p>
            <p css={heroParagraph}>
              For a few weeks only, read Edition Earth, a new and exclusive showcase of the best Guardian journalism
              on the climate, wildlife, air pollution, environmental justice — and solutions.
            </p>
            <ThemeProvider theme={buttonBrand}>
              <LinkButton
                onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)}
                priority="tertiary"
                iconSide="right"
                icon={<SvgArrowDownStraight />}
                href="#subscribe"
              >
                See pricing options
              </LinkButton>
            </ThemeProvider>
          </section>
        </Hero>
      </CentredContainer>
    </PageTitle>
  );
}

export default PaperHero;
