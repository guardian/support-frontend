// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgChevronDownSingle } from '@guardian/src-icons';
import { space } from '@guardian/src-foundations';
import { body, titlepiece } from '@guardian/src-foundations/typography';

import CentredContainer from 'components/containers/CentredContainer';
import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/PageTitle';
import Hero from 'components/page/Hero';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

type PropTypes = {|
  orderIsAGift: boolean;
  copy: {
    title: Node,
    paragraph: Node,
  };
|};

const weeklyHeroCopy = css`
  padding: ${space[3]}px;
`;

const weeklyHeroTitle = css`
  ${titlepiece.small()};
  margin-bottom: ${space[3]};
`;

const weeklyHeroParagraph = css`
  ${body.medium({ lineHeight: 'loose' })}
  margin-bottom: ${space[9]}px;
`;

function WeeklyHero({ orderIsAGift, copy }: PropTypes) {
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
            sizes="(max-width: 480px) 200px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
            imgType="png"
            altText="A collection of Guardian Weekly magazines"
          />}
        >
          <section css={weeklyHeroCopy}>
            <h2 css={weeklyHeroTitle}>{copy.title}</h2>
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
