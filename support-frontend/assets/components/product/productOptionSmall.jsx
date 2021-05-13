// @flow

import React, { type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { textSans } from '@guardian/src-foundations/typography';
import { LinkButton, buttonReaderRevenue } from '@guardian/src-button';

export type ProductSmall = {
  offerCopy: string,
  priceCopy: Node,
  buttonCopy: string,
  href: string,
  onClick: Function,
  cssOverrides?: string | string[],
}

const productOptionSmallStyles = css`
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${space[1]}px 0 ${space[6]}px;
  padding-right: ${space[4]}px;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${brand[600]};
  }

  ${from.tablet} {
    padding-top: ${space[6]}px;
  }
`;

const offerCopyStyles = css`
  ${textSans.medium({ fontWeight: 'bold' })}
  margin-bottom: ${space[2]}px;
`;

const priceCopyStyles = css`
  ${textSans.xsmall()}
  margin-top: ${space[2]}px;
`;

function ProductOptionSmall(props: ProductSmall) {
  return (
    <span css={[productOptionSmallStyles, props.cssOverrides]}>
      <p css={offerCopyStyles}>{props.offerCopy}</p>
      <ThemeProvider theme={buttonReaderRevenue}>
        <LinkButton
          href={props.href}
          onClick={props.onClick}
        >
          {props.buttonCopy}
        </LinkButton>
      </ThemeProvider>
      <p css={priceCopyStyles}>{props.priceCopy}</p>
    </span>
  );
}

ProductOptionSmall.defaultProps = {
  offerCopy: '',
  cssOverrides: '',
};

export default ProductOptionSmall;
