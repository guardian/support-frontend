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
import GridPicture from 'components/gridPicture/gridPicture';
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
  ${from.tablet} {
    padding-bottom: ${space[9]}px;
  }
  ${from.desktop} {
    padding-bottom: ${space[24]}px;
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
  margin-bottom: ${space[6]}px;
  ${from.desktop} {
    max-width: 75%;
    margin-bottom: ${space[9]}px;
  }
`;

const roundelLines = css`
  ${headline.xxxsmall({ fontWeight: 'bold' })}
  ${from.tablet} {
    ${headline.xxsmall({ fontWeight: 'bold' })}
  }
`;

const roundelCentreLine = css`
  ${headline.medium({ fontWeight: 'bold' })}
  ${from.tablet} {
    ${headline.xlarge({ fontWeight: 'bold' })}
  }
`;

const mobileLineBreak = css`
  ${from.tablet} {
    display: none;
  }
`;

const tabletLineBreak = css`
  ${from.desktop} {
    display: none;
  }
`;


function PaperHero({ productPrices }: PropTypes) {
  const maxSavingVsRetail = productPrices ? getMaxSavingVsRetail(productPrices) : 0;
  const { roundel } = getDiscountCopy(maxSavingVsRetail);
  const roundelText = (
    <>
      {/* role="text" is non-standardised but works in Safari. Ensures the whole section is read as one text element */}
      {/* eslint-disable-next-line jsx-a11y/aria-role */}
      <div role="text" css={roundelLines}>
        {roundel.map((text, index) => {
          if (index === 1) {
            return <div css={roundelCentreLine}>{text}</div>;
          }
          return text;
        })}
      </div>
    </>
  );

  const heroImages = [
    {
      gridId: 'printCampaignHeroMobile',
      srcSizes: [500, 140],
      imgType: 'png',
      sizes: '(max-width: 739px) 100%',
      media: '(max-width: 739px)',
    },
    {
      gridId: 'printCampaignHeroMobile',
      srcSizes: [1055, 1000, 500],
      imgType: 'png',
      sizes: '(min-width: 740px) 100%',
      media: '(min-width: 740px)',
    },
  ];

  return (
    <PageTitle
      title="Newspaper subscription"
      theme="paper"
    >
      <CentredContainer>
        <Hero
          image={<GridPicture
            sources={heroImages}
            fallback="printCampaignHeroDesktop"
            fallbackSize={500}
            altText="Newspapers"
            fallbackImgType="png"
          />}
          roundelText={roundelText}
          roundelNudgeDirection="down"
          hideRoundelBelow="mobileMedium"
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>
              Guardian <br css={mobileLineBreak} />and&nbsp;Observer <br css={mobileLineBreak} />
              newspaper subscriptions <br css={tabletLineBreak} />
              <span css={heroTitleHighlight}>to suit every reader</span>
            </h2>
            <p css={heroParagraph}>
              We offer a range of packages from every day to weekend, and different subscription types depending on
              whether you want to collect your paper in a shop or get it delivered.
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
