// @flow

import React, { type Element } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { neutral, brandAlt } from '@guardian/src-foundations/palette';
import { body, headline } from '@guardian/src-foundations/typography';
import { type Option } from 'helpers/types/option';
import FlexContainer from 'components/containers/FlexContainer';
import ProductOption, {
  ProductOptionButton,
  ProductOptionContent,
  ProductOptionOffer,
  ProductOptionTitle,
} from 'components/productOption/productOption';


export type PaymentOption = {
  title: string,
  href: string,
  salesCopy: Element<'span'>,
  offer: Option<string>,
  onClick: Function,
  label: Option<string>,
}

export type PropTypes = {|
  paymentOptions: PaymentOption[],
|};

const pricesSection = css`
  padding: 0 ${space[12]}px ${space[12]}px;
`;

const priceBoxes = css`
  margin-top: ${space[9]}px;
  justify-content: flex-start;
  align-items: stretch;
`;

const priceBox = css`
  position: relative;
  width: 300px;
  height: 272px;

  &:not(:last-of-type) {
    margin-right: ${space[5]}px;
  }

  & > div {
    height: 100%;
  }
`;

const priceLabel = css`
  background-color: ${brandAlt[400]};
  color: ${neutral[7]};
  position: absolute;
  left: 0;
  top: 1px;
  transform: translateY(-100%);
  text-align: center;
  padding: ${space[2]}px ${space[3]}px;
  ${headline.xxsmall({ fontWeight: 'bold' })};
`;

const pricesHeadline = css`
  ${headline.medium({ fontWeight: 'bold' })};
`;

const pricesSubHeadline = css`
  ${body.medium()}
`;

function Prices({ paymentOptions }: PropTypes) {
  return (
    <section css={pricesSection} id="subscribe">
      <h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
      <h4 css={pricesSubHeadline}>Select a gift period</h4>
      <FlexContainer cssOverrides={priceBoxes}>
        {paymentOptions.map(paymentOption => (
          <div css={priceBox}>
            {paymentOption.label &&
              <span css={priceLabel}>
                {paymentOption.label}
              </span>
            }
            <ProductOption>
              <ProductOptionContent>
                <ProductOptionTitle>{paymentOption.title}</ProductOptionTitle>
                <ProductOptionOffer
                  hidden={!paymentOption.offer}
                >
                  {paymentOption.offer}
                </ProductOptionOffer>
              </ProductOptionContent>
              <ProductOptionButton
                href={paymentOption.href}
                onClick={paymentOption.onClick}
                aria-label="Subscribe-button"
                salesCopy={paymentOption.salesCopy}
              >
                {'Start free trial now'}
              </ProductOptionButton>
            </ProductOption>
          </div>
        ))}
      </FlexContainer>
    </section>
  );
}

export default Prices;
