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
    max-width: 85%;
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
          roundelNudgeDirection="down"
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>
              Subscribe to<br />
              <span css={heroTitleHighlight}>The&nbsp;Guardian and&nbsp;The&nbsp;Observer</span>
            </h2>
            <p css={heroParagraph}>
              <strong>Choose from a range of packages to suit you.</strong><br />
              We offer two different subscription types: subscription cards and home delivery.
              Pick the most convenient option available in your area.
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
