// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { headline, body } from '@guardian/src-foundations/typography';


type PropTypes = {|
  image: Node,
  children: Node,
  cssOverrides?: string,
  roundelText?: Node,
|}

const hero = css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${neutral[100]};
  border: none;
  padding-top: ${space[3]}px;
  background-color: ${brand[400]};
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

const heroRoundel = css`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  right: ${space[12]}px;
  transform: translateY(-50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-color: ${brandAlt[400]};
  color: ${neutral[7]};
  ${headline.small({ fontWeight: 'bold' })};
  z-index: 2;
`;

function Hero({
  children, image, cssOverrides, roundelText,
}: PropTypes) {
  return (
    <div css={[hero, cssOverrides]}>
      {roundelText && <div css={heroRoundel}>{roundelText}</div>}
      {children}
      <div css={heroImage}>
        {image}
      </div>
    </div>
  );
}

Hero.defaultProps = {
  cssOverrides: '',
  roundelText: null,
};

export default Hero;
