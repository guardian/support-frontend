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

import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';
import GiftHeadingAnimation from 'components/animations/giftHeadingAnimation';

import {
  detect,
  GBPCountries,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { fromCountryGroupId, glyph } from 'helpers/internationalisation/currency';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

type PropTypes = {|
  orderIsAGift: boolean;
  countryGroupId: CountryGroupId;
  promotionCopy: PromotionCopy;
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

const giftHeroSubHeading = css`
  font-weight: 700;
`;

const getRegionalCopyFor = (region: CountryGroupId) => (region === GBPCountries ?
  <span>Find clarity with The Guardian&apos;s global magazine</span> :
  <span>Read The Guardian in print</span>);

const getFirstParagraph = (promotionCopy: PromotionCopy, orderIsAGift: boolean) => {
  if (promotionCopy.description) {
    return (
    /* eslint-disable react/no-danger */
      <>
        <span
          className="promotion-description"
          dangerouslySetInnerHTML={
          { __html: promotionCopy.description }
        }
        />
      </>);
    /* eslint-enable react/no-danger */
  }
  if (orderIsAGift) {
    return (
      <>
        <h3 css={giftHeroSubHeading}>Stay on the same page, even when you’re apart</h3>
        <p>Share the gift of clarity with the Guardian Weekly magazine. A round-up of the world news, opinion and long
        reads that have shaped the week, all handpicked from The Guardian and The Observer.
        </p>
      </>
    );
  }
  return (
    <>
      The Guardian Weekly magazine is a round-up of the world news, opinion and long reads that have shaped the week.
      Inside, the past seven days' most memorable stories are reframed with striking photography and insightful
      companion pieces, all handpicked from The Guardian and The Observer.
    </>);
};

function WeeklyHero({ orderIsAGift, countryGroupId, promotionCopy }: PropTypes) {
  const currencyId = fromCountryGroupId(countryGroupId) || 'GBP';

  const defaultRoundelText = (
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

  const defaultTitle = orderIsAGift ?
    null
    : getRegionalCopyFor(detect());

  const title = promotionCopy.title || defaultTitle;

  const copy = getFirstParagraph(promotionCopy, orderIsAGift);

  const roundelText = promotionCopy.roundel ? (<>
    <span
      // eslint-disable-next-line jsx-a11y/aria-role
      role="text"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={
      { __html: promotionCopy.roundel }
    }
    />
  </>) : defaultRoundelText;

  return (
    <PageTitle
      title={orderIsAGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
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
              <h2 css={weeklyHeroTitle}>{title}</h2>
            }
            <p css={weeklyHeroParagraph}>
              {copy}
            </p>
            <ThemeProvider theme={buttonBrand}>
              <LinkButton
                onClick={sendTrackingEventsOnClick({
                  id: 'options_cta_click',
                  product: 'GuardianWeekly',
                  componentType: 'ACQUISITIONS_BUTTON',
              })}
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

export { WeeklyHero };
