// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { brand, neutral } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { headline, body } from '@guardian/src-foundations/typography';


type PropTypes = {|
  image: Node,
  children: Node,
  cssOverrides?: string
|}

const hero = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${neutral[100]};
  border: none;
  padding-top: ${space[3]}px;
  background-color: ${brand[400]};
  overflow: hidden;
  width: 100%;

  ${from.tablet} {
    flex-direction: row;
    & > * {
      max-width: 50%;
    }
  }


  /* Typography defaults */
  ${body.small()};

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.desktop} {
    ${headline.xxsmall()};
    line-height: 135%;
  }
`;

const heroImage = css`
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  & img {
    width: 100%;
  }
  ${until.tablet} {
    order: -1;
  }
`;

function Hero({ children, image, cssOverrides }: PropTypes) {
  return (
    <div css={[hero, cssOverrides]}>
      {children}
      <div css={heroImage}>
        {image}
      </div>
    </div>
  );
}

Hero.defaultProps = {
  cssOverrides: '',
};

export default Hero;
