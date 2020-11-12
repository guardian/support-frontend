// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgChevronDownSingle } from '@guardian/src-icons';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';

import CentredContainer from 'components/containers/CentredContainer';
import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/PageTitle';
import Hero from 'components/page/Hero';
import GiftHeadingAnimation from 'components/animations/GiftHeadingAnimation';

import { glyph, type IsoCurrency } from 'helpers/internationalisation/currency';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

type PropTypes = {|
  orderIsAGift: boolean;
  currencyId: IsoCurrency;
  copy: {
    title: Node,
    paragraph: Node,
  };
|};

const weeklyHeroCopy = css`
  padding: 0 ${space[3]}px ${space[3]}px;
`;

const weeklyHeroTitle = css`
  ${headline.medium({ fontWeight: 'bold' })};
  margin-bottom: ${space[3]}px;

  ${from.tablet} {
    ${headline.large({ fontWeight: 'bold' })};
  }
`;

const weeklyHeroParagraph = css`
  ${body.medium({ lineHeight: 'loose' })}
  margin-bottom: ${space[9]}px;
`;

const roundelCentreLine = css`
  ${headline.small({ fontWeight: 'bold' })}
  ${from.tablet} {
    ${headline.large({ fontWeight: 'bold' })}
  }
`;


function WeeklyHero({ orderIsAGift, currencyId, copy }: PropTypes) {
  const roundelText = (
    <>
      {/* role="text" is non-standardised but works in Safari. Ensures the whole section is read as one text element */}
      {/* eslint-disable-next-line jsx-a11y/aria-role */}
      <div role="text">
        Try
        <div css={roundelCentreLine}>6 issues</div>
        for {glyph(currencyId)}6
      </div>
    </>
  );

  return (
    <PageTitle
      title={orderIsAGift ? 'Gift the Guardian Weekly' : 'The Guardian Weekly'}
      theme="weekly"
    >
      <CentredContainer>
        <Hero
          image={<GridImage
            gridId="weeklyCampaignHeroImg"
            srcSizes={[1000, 500, 140]}
            sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
            imgType="png"
            altText="A collection of Guardian Weekly magazines"
          />}
          roundelText={orderIsAGift ? null : roundelText}
        >
          <section css={weeklyHeroCopy}>
            {orderIsAGift ?
              <GiftHeadingAnimation /> :
              <h2 css={weeklyHeroTitle}>{copy.title}</h2>
            }
            <p css={weeklyHeroParagraph}>
              {copy.paragraph}
            </p>
            <ThemeProvider theme={buttonBrand}>
              <LinkButton
                onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)}
                priority="tertiary"
                iconSide="right"
                icon={<SvgChevronDownSingle />}
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

export { WeeklyHero };
