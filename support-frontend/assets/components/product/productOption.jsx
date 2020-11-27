// @flow

import React, { type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { brandAlt, neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { headline, textSans } from '@guardian/src-foundations/typography';
import { from } from '@guardian/src-foundations/mq';
import { LinkButton, buttonReaderRevenue } from '@guardian/src-button';

export type Product = {
  title: string,
  price: string,
  children?: Node,
  offerCopy?: string,
  priceCopy: Node,
  buttonCopy: string,
  href: string,
  onClick: Function,
  label?: string,
  cssOverrides?: string,
}

const productOption = css`
  ${textSans.medium()}
  position: relative;
  display: grid;
  grid-template-rows: 48px 66px 100px 86px;
  width: 100%;
  background-color: ${neutral[100]};
  color: ${neutral[7]};
  padding: ${space[3]}px;
  ${from.tablet} {
    min-height: 272px;
    width: 300px;
  }
`;

const productOptionUnderline = css`
  border-bottom: 1px solid ${neutral[86]};
`;

const productOptionTitle = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  padding-bottom: ${space[2]}px;
  margin-bottom: ${space[4]}px;
`;

const productOptionOfferCopy = css`
  height: 100%;
`;

const productOptionPrice = css`
  display: block;
  ${headline.large({ fontWeight: 'bold' })};
`;

const productOptionPriceCopy = css`
  height: 100%;
  margin-bottom: ${space[4]}px;
`;

const productOptionHighlight = css`
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

function ProductOption(props: Product) {
  return (
    <div css={[productOption, props.cssOverrides]}>
      <div>
        <h3 css={[productOptionTitle, productOptionUnderline]}>{props.title}</h3>
        {props.label && <span css={productOptionHighlight}>{props.label}</span>}
        {props.children && props.children}
      </div>
      <div>
        <p css={[productOptionOfferCopy, productOptionUnderline]}>
          {props.offerCopy}
        </p>
      </div>
      <div>
        {/* role="text" is non-standardised but works in Safari. Reads the whole section as one text element */}
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <p role="text" css={productOptionPriceCopy}>
          <span css={productOptionPrice}>{props.price}</span>
          {props.priceCopy}
        </p>
        <ThemeProvider theme={buttonReaderRevenue}>
          <LinkButton
            href={props.href}
            onClick={props.onClick}
            aria-label={`${props.title}- ${props.buttonCopy}`}
          >
            {props.buttonCopy}
          </LinkButton>
        </ThemeProvider>
      </div>
    </div>
  );
}

ProductOption.defaultProps = {
  children: null,
  label: '',
  offerCopy: '',
  cssOverrides: '',
};

export default ProductOption;
