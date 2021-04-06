// @flow
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';
import FlexContainer from 'components/containers/flexContainer';

import PaymentSelection
  from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';

const defaultPricesSection = css`
  padding: 0 ${space[3]}px ${space[12]}px;
`;

const headerPricesSection = css`
  padding: 0 ${space[3]}px ${space[3]}px;
`;

const priceBoxes = css`
  margin-top: ${space[6]}px;
  justify-content: flex-start;
  align-items: stretch;
  ${from.desktop} {
    margin-top: ${space[9]}px;
  }
`;

const pricesHeadline = css`
  ${headline.medium({ fontWeight: 'bold' })};
`;

const pricesSubHeadline = css`
  ${body.medium()}
  padding-bottom: ${space[2]}px;
`;

const ctaCopy = {
  standard: {
    title: 'Choose one of our special offers and subscribe today',
    paragraph: <>After your <strong>14-day free trial</strong>, your
      subscription will begin automatically and you can cancel any time</>,
  },
  gift: {
    title: 'Choose one of our special gift offers',
    paragraph: 'Select a gift period',
  },
};

function Prices({ orderIsAGift, isInHero }: { orderIsAGift: boolean, isInHero?: boolean}) {
  const copy = orderIsAGift ? ctaCopy.gift : ctaCopy.standard;
  const sectionCss = isInHero ? headerPricesSection : defaultPricesSection;
  const titleCopy = isInHero ?
    'Become a digital subscriber today and help to fund our vital work'
    :
    copy.title;
  return (
    <section css={sectionCss} id="subscribe">
      <h2 css={pricesHeadline}>{titleCopy}</h2>
      <p css={pricesSubHeadline}>{copy.paragraph}</p>
      <FlexContainer cssOverrides={priceBoxes}>
        <PaymentSelection />
      </FlexContainer>
    </section>
  );
}

Prices.defaultProps = {
  isInHero: false,
};

export default Prices;
