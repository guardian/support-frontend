// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';

const marginRules = `display: block;
content: "";
flex-basis: 0;
flex-grow: 1;`;

type PropTypes = {|
  children: Node,
  before: boolean,
  after: boolean
|}

const withMarginsStyle = css`
  display: flex;
`;

const afterStyle = css`
  ${from.tablet} {
    &:after {
      ${marginRules}
    }
  }
`;

const beforeStyle = css`
  ${from.tablet} {
    &:before {
      ${marginRules}
    }
  }
`;

export function WithMargins({ children, before, after }: PropTypes) {
  return (
    <div css={[
     withMarginsStyle,
     before ? beforeStyle : '',
     after ? afterStyle : '',
   ]}
    >
      {children}
    </div>
  );
}
